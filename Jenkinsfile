pipeline {
    agent any
    tools {
        nodejs "Nodejs"
    }
    environment {
        APP_PATH = "/home/ankit/apps/the-polyclinic"
        PM2_HOME = "/home/ankit/.pm2"
        MONGODB_URI = credentials('MONGODB_URI')
        SLACK_CHANNEL = "#jenkins-ci"
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
                    export MONGODB_URI=${MONGODB_URI}
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
                    pm2 restart the-polyclinic || pm2 start pnpm --name "the-polyclinic" -- run start
                '''
            }
        }
    }
    post {
        success {
            slackSend channel: "${SLACK_CHANNEL}",
                      color: 'good',
                      message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' completed successfully! (${env.BUILD_URL})"
        }
        failure {
            slackSend channel: "${SLACK_CHANNEL}",
                      color: 'danger',
                      message: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed! (${env.BUILD_URL})"
        }
    }
}