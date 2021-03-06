from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def unique_username(form, field):
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError("Username is already in use.")


def unique_email(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("Email is already in use.")


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[
                           DataRequired(), unique_username])
    email = StringField('email', validators=[DataRequired(), unique_email])
    password = StringField('password', validators=[DataRequired()])
