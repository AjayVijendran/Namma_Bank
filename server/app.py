from flask import Flask,request,jsonify,make_response
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_cors import CORS
import uuid
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash,check_password_hash
app = Flask(__name__)
CORS(app,supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI']="postgresql://postgres:1234@localhost:5432/namma_bank"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['SECRET_KEY'] = 'thissecretkey'
db = SQLAlchemy(app)
class customer(db.Model):
    customer_id = db.Column(db.String(100),primary_key=True)
    name = db.Column(db.String(50))
    age = db.Column(db.Integer)
    email = db.Column(db.String(70))
    phone_no = db.Column(db.BigInteger)
    address = db.Column(db.String(400))

    def __repr__(self):
        return f'User: {self.customer_id}, Name:{self.name}'
class account(db.Model):
    account_no = db.Column(db.BigInteger,primary_key=True)
    balance = db.Column(db.Integer)
    customer_id = db.Column(db.String(100),db.ForeignKey('customer.customer_id'),nullable=False)
    acc_type = db.Column(db.String(10))
    pin = db.Column(db.String(256))
    customer = db.relationship('customer',backref = db.backref('customers',lazy=True))
    def __repr__(self):
        return f'Acc_No: {self.account_no},balance:{self.balance}'
class transaction(db.Model):
    amount = db.Column(db.Integer)
    transaction_id = db.Column(db.BigInteger,primary_key=True)
    sacc_no = db.Column(db.Integer)
    dacc_no = db.Column(db.Integer)
    at_time = db.Column(db.DateTime,default = datetime.datetime.utcnow)
    def __repr__(self):
        return f'Amt: {self.amount},transaction_id:{self.transaction_id},at: {self.at_time}'
class auth_table(db.Model):
    admin = db.Column(db.Boolean)
    email = db.Column(db.String(30),primary_key=True)
    pwd = db.Column(db.String(256))
    global_id = db.Column(db.String(100))
app.app_context().push()
def format_cust(cust):
    return {
        "customer_id"  : cust.customer_id,
        "name" : cust.name,
        "email": cust.email,
        "age" : cust.age or '',
        "phone_no"  : cust.phone_no or '',
        "address" : cust.address or ''
    }
def format_acc(acc):
    return {
        'customer_id' : acc.customer_id,
        'account_no' : acc.account_no,
        'balance' : acc.balance,
        'acc_type' : acc.acc_type
    }
def token_reqd(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None
        if request.cookies.get('jwt'):
            token = request.cookies.get('jwt')
        if not token:
            return jsonify({"message": "Invalid Token, Login Again"}),401
        try:
            data = jwt.decode(token,app.config['SECRET_KEY'],algorithms=['HS256'])
            current_user = auth_table.query.filter_by(global_id=data['global_id']).one()
        except:
            return jsonify({"message": "Invalid Token, Login Again"}),401
        return f(current_user,*args,**kwargs)
    return decorated
@app.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    hashed_pwd = generate_password_hash(data['pwd'],method='sha256')
    new_user = auth_table(global_id = str(uuid.uuid4()),email=data['email'],pwd = hashed_pwd,admin=False)
    db.session.add(new_user)
    db.session.commit()
    cust  = customer(customer_id = new_user.global_id,name=data['name'],email=data['email'])
    db.session.add(cust)
    db.session.commit()
    return jsonify({"message": "New user created"})
@app.route('/login',methods=['POST'])
def login():
    auth = request.get_json()
    print(auth)
    if not auth or not auth['username'] or not auth['password']:
        return make_response("Could not Autheticate, check ur details",401,{'WWW-authenticate':'Basic realm="Login required!"'})
    user = auth_table.query.filter_by(email = auth['username']).first()
    print(user)
    if not user:
        return make_response({"message":"Email doesnt exits,Kindly register"},400)
    if check_password_hash(user.pwd,auth['password']):
        token = jwt.encode({'global_id':user.global_id,'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=45)},app.config['SECRET_KEY'])
        cust = customer.query.filter_by(customer_id=user.global_id).one()
        resp = make_response(format_cust(cust),200)
        resp.set_cookie('jwt',token,httponly=True,secure=True)
        return resp
    return make_response({"message":"Wrong Password"},400)

@app.route('/cust',methods=['GET','POST'])
@app.route('/cust/<user_id>',methods=['GET','DELETE','PUT'])
@token_reqd
def crud_acct(current_user,user_id=None):
    if user_id : 
        try :
            customer.query.filter_by(customer_id=user_id).one()
        except:
            return f"Customer with id : {user_id} is not found in the database"
    if request.method =='POST':
        name = request.json['name']
        email = request.json['email']
        cust  = customer(name=name,email=email)
        db.session.add(cust)
        db.session.commit()
        return format_cust(cust)
    if request.method =='GET':
        if user_id:
            cust = customer.query.filter_by(customer_id = user_id).one()
            return {"event":format_cust(cust)}
        cust = customer.query.all()
        l=[]
        for i in cust:
            l.append(format_cust(i))
        return {"customers" : l } 
    if request.method =='DELETE':
        cust = customer.query.filter_by(customer_id = user_id).one()
        db.session.delete(cust)
        db.session.commit()
        return f"Customer with id {user_id} is removed from the Database successfully"
    if request.method =='PUT':
        cust = customer.query.filter_by(customer_id = user_id)
        name = request.json.get('name',cust.one().name) or cust.one().name
        email = request.json.get('email',cust.one().email) or cust.one().email
        age = request.json.get('age',cust.one().age) or cust.one().age
        phone_no = request.json.get('phone_no',cust.one().phone_no) or cust.one().phone_no
        address = request.json.get('address',cust.one().address) or cust.one().address
        cust.update(dict(name = name,email = email,age=age,phone_no=phone_no,address=address))
        db.session.commit()
        return format_cust(cust.one())
@app.route('/acc/<user_id>',methods=['POST','PUT','GET','DELETE'])
@token_reqd
def accnt(current_user,user_id=None):
    print(user_id)
    if user_id : 
        try :
            customer.query.filter_by(customer_id=user_id).one()
        except:
            return f"Customer with id : {user_id} is not found in the database"
    if request.method =='POST':
        try : 
            account.query.filter_by(customer_id=user_id).one()
            return make_response({"message":"Account already exists"},400)
        except:
            balance = request.json['balance']
            acc_type = request.json['acc_type']
            acc = account(customer_id=user_id,acc_type=acc_type,balance=balance)
            db.session.add(acc)
            db.session.commit()
            return format_acc(acc)
    if request.method =='GET':
        try : 
            acc = account.query.filter_by(customer_id=user_id).one()
            return jsonify({"balance":acc.balance,"acc_no":acc.account_no})
        except:
             return make_response({"message":"Account Does not Exist "},400)

@app.route('/pin/<user_id>',methods=['POST'])
@token_reqd
def setreset_pin(current_user,user_id):
    if user_id:
        try :
            customer.query.filter_by(customer_id=user_id).one()
        except:
            return f"Customer with id : {user_id} is not found in the database"
    pin  = request.json['pin']
    exispin = request.json['exispin']
    try : 
            acc = account.query.filter_by(customer_id=user_id)
    except:
           return make_response({"message":"Create account to Proceed"},400)
    if exispin:
        oldpin = jwt.decode(acc.one().pin,app.config['SECRET_KEY'],algorithms=['HS256'])
        if exispin==oldpin['pin']:
            encoded_pin = jwt.encode({'pin':pin,'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=45)},app.config['SECRET_KEY'])
            acc.update(dict(account_no = acc.one().account_no ,pin=encoded_pin,customer_id=user_id,balance=acc.one().balance,acc_type = acc.one().acc_type))
            db.session.commit()
            return make_response({"message":"PIN Successfully ReSet"},200)
        return make_response({"message":"Invalid Old Pin"},400)
    else:
        encoded_pin = jwt.encode({'pin':pin,'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=45)},app.config['SECRET_KEY'])
        if acc.one().pin:
            return make_response({"message":"PIN already exists,Kindly go for PIN reset"},400)
        acc.update(dict(account_no = acc.one().account_no ,pin=encoded_pin,customer_id=user_id,balance=acc.one().balance,acc_type = acc.one().acc_type))
        db.session.commit()
        return make_response({"message":"PIN Successfully Set"},200)




if __name__=="__main__":
    db.create_all()
    app.run(debug=True)
