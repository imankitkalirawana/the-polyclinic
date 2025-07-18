pipeline {
    agent any
    tools {
        nodejs "Nodejs"
    }
    options {
        retry(2)
        timeout(time: 10, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
    }
    environment {
        APP_PATH = "/home/ankit/apps/the-polyclinic"
        PM2_HOME = "/home/ankit/.pm2"
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
                withCredentials([file(credentialsId: 'thepolyclinic-env', variable: 'ENV_FILE')]) {
                    sh '''
                        cp $ENV_FILE .env
                        pnpm run build -- --max-old-space-size=1700
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    export PM2_HOME=/home/ankit/.pm2
                    cp -r .next package.json pnpm-lock.yaml public .env ${APP_PATH}
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
                      message: """SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'
                                  Build URL: ${env.BUILD_URL}
                                  Branch: ${env.GIT_BRANCH}
                                  Commit: ${env.GIT_COMMIT?.substring(0, 7)}
                                  Duration: ${currentBuild.durationString}
                                  Completed successfully!"""
        }
        failure {
            slackSend channel: "${SLACK_CHANNEL}",
                      color: 'danger',
                      message: """FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'
                                  Build URL: ${env.BUILD_URL}
                                  Branch: ${env.GIT_BRANCH}
                                  Commit: ${env.GIT_COMMIT?.substring(0, 7)}
                                  Duration: ${currentBuild.durationString}
                                  Failed! Please check the logs for details."""
        }
        always {
            cleanWs()
        }
    }

}