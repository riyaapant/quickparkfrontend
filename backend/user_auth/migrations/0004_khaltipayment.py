# Generated by Django 5.0.6 on 2024-06-23 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0003_payment'),
    ]

    operations = [
        migrations.CreateModel(
            name='KhaltiPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pidx', models.CharField(max_length=30)),
                ('user_id', models.IntegerField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_verified', models.BooleanField(default=False)),
            ],
        ),
    ]