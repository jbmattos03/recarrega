#!/bin/bash

JWT_SECRET=$(openssl rand -hex 32)
DB_NAME="recarrega"
DB_USER="recarrega_user"
DB_PASSWORD=$(openssl rand -base64 16)
DB_HOST="localhost"
PORT="8081"

# Check if .env exists
if ! [ -e ".env" ]; then
    touch ./.env
fi

# Insert variables in .env
# JWT_SECRET
if grep -q "^JWT_SECRET=" ./.env; then
    sed -i "s#^JWT_SECRET=.*#JWT_SECRET=$JWT_SECRET#" ./.env
else
    echo "JWT_SECRET=$JWT_SECRET" >> ./.env
fi

# Ask for mariadb root password
echo "Please enter your MariaDB root password to create the database and user:"
read -s MARIADB_ROOT_PASSWORD

# Create user if it does not exist
if ! mariadb -u root -p"$MARIADB_ROOT_PASSWORD" -sN -e "SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = '$DB_USER');" | grep -q 1; then
    mariadb -u root -p"$MARIADB_ROOT_PASSWORD" -e "CREATE USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';"
    mariadb -u root -p"$MARIADB_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';"
    mariadb -u root -p"$MARIADB_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

    echo "User $DB_USER created and granted privileges on $DB_NAME."
else 
    echo "User $DB_USER already exists."
fi

# DB_NAME
if grep -q "^DB_NAME=" ./.env; then
    sed -i "s#^DB_NAME=.*#DB_NAME=$DB_NAME#" ./.env
else
    echo "DB_NAME=$DB_NAME" >> ./.env
fi

# DB_USER
if grep -q "^DB_USER=" ./.env; then
    sed -i "s#^DB_USER=.*#DB_USER=$DB_USER#" ./.env
else
    echo "DB_USER=$DB_USER" >> ./.env
fi

# DB_PASSWORD
if grep -q "^DB_PASSWORD=" ./.env; then
    sed -i "s#^DB_PASSWORD=.*#DB_PASSWORD=$DB_PASSWORD#" ./.env
else
    echo "DB_PASSWORD=$DB_PASSWORD" >> ./.env
fi

# DB_HOST
if grep -q "^DB_HOST=" ./.env; then
    sed -i "s#^DB_HOST=.*#DB_HOST=$DB_HOST#" ./.env
else
    echo "DB_HOST=$DB_HOST" >> ./.env
fi

# PORT
if grep -q "^PORT=" ./.env; then
    sed -i "s#^PORT=.*#PORT=$PORT#" ./.env
else
    echo "PORT=$PORT" >> ./.env
fi

# Ask the user for their preferred log level
echo "Please enter your preferred log level (e.g., debug, info, warn, error):"
read LOG_LEVEL

# LOG_LEVEL
if grep -q "^LOG_LEVEL=" ./.env; then
    sed -i "s#^LOG_LEVEL=.*#LOG_LEVEL=$LOG_LEVEL#" ./.env
else
    echo "LOG_LEVEL=$LOG_LEVEL" >> ./.env
fi

echo ".env file has been created or updated with the necessary environment variables."