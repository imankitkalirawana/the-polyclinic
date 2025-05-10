pipeline {
    agent any
    tools {
        nodejs "Nodejs"
    }
    environment {
        APP_PATH = "/home/ankit/apps/the-polyclinic"
        PM2_HOME = "/home/ankit/.pm2"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    pnpm install || pnpm install --no-frozen-lockfile
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                    pnpm run build
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    export PM2_HOME=/home/ankit/.pm2
                    cp -r .next ${APP_PATH}
                    cd ${APP_PATH}
                    pnpm install --production
                    pm2 restart the-polyclinic
                '''
            }
        }
    }
}
