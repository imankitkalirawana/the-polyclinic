pipeline {
    agent any
    tools {
        nodejs "Nodejs" 
    }
    environment {
        APP_PATH = "/apps/the-polyclinic" 
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/imankitkalirawana/the-polyclinic.git', credentialsId: 'github-token', branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
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
                    cp -r .next ${APP_PATH}/.next
                    cp -r public ${APP_PATH}/public
                    cp package.json ${APP_PATH}/package.json
                    cp next.config.js ${APP_PATH}/next.config.js
                    cd ${APP_PATH}
                    pnpm install --production
                    pm2 restart nextjs-app || pm2 start pnpm --name "nextjs-app" -- start
                '''
            }
        }
    }
}