pipeline {
    agent any
    tools {
        nodejs "Nodejs" // Ensure this matches Global Tool Configuration
    }
    environment {
        APP_PATH = "/home/ankit/apps/the-polyclinic"
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/imankitkalirawana/the-polyclinic.git', credentialsId: 'github-token', branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install -g pnpm
                    pnpm install || pnpm install --no-frozen-lockfile
                '''
            }
        }
        stage('Build') {
            steps {
                sh 'pnpm run build'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    mkdir -p ${APP_PATH}
                    cp -r .next ${APP_PATH}/.next
                    cp -r public ${APP_PATH}/public
                    cp package.json ${APP_PATH}/package.json
                    cp next.config.js ${APP_PATH}/next.config.js
                    cd ${APP_PATH}
                    pnpm install --production
                    pm2 restart the-polyclinic || pm2 start pnpm --name "the-polyclinic" -- run start
                '''
            }
        }
    }
}