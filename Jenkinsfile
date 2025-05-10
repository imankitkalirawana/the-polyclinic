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
                git url: 'https://github.com/imankitkalirawana/the-polyclinic.git', credentialsId: 'github-token', branch: 'master'
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
                    cp -r .next ${APP_PATH}
                    cd ${APP_PATH}
                    pnpm install --production
                    pm2 restart the-polyclinic || pm2 start pnpm --name "the-polyclinic" -- run start
                '''
            }
        }
    }
}