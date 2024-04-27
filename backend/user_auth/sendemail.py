from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

def send_verification(user):
    token = default_token_generator.make_token(user)
    verification_url = f'http://localhost:8000/verify/{user.id}/{token}'
    subject = 'Verify Your Email'
    message = f'Click on the following link verify your email : {verification_url}'
    recipient = user.email
    result = send_mail(
        subject = subject,
        message = message,
        from_email = settings.EMAIL_HOST_USER,
        recipient_list = [recipient],
        fail_silently = False
    )
    return result




def reset_password(user):
    token = default_token_generator.make_token(user)
    verification_url = f'http://localhost:8000/reset/{user.id}/{token}'
    subject = 'Password Recovery'
    message = f'Click on the following link to reset your password: {verification_url}'
    recipient = user.email
    result = send_mail(
        subject = subject,
        message = message,
        from_email = settings.EMAIL_HOST_USER,
        recipient = [recipient],
        fail_silently = False
    )
    return result