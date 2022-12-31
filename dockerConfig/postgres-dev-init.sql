CREATE USER deploy with encrypted password 'password';
CREATE DATABASE gncs_app;
GRANT ALL PRIVILEGES ON DATABASE gncs_app TO deploy;
