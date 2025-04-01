pipeline {
    agent any

    environment {
        SSH_CRED_ID = '1c5d625b-c431-471e-8a91-fde82d4b4b0b'
        REMOTE_USER = 'root'
        REMOTE_DIR = '/var/www/wojtur.eu/giga-chat-ui'
        SERVER_IP = credentials('64a86f43-237c-40cd-a377-56f0e9d27420')
        DATE_FOLDER = "build-${new Date().format('yyyyMMdd-HHmm')}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'npm run build -- --configuration=production --output-path=dist/$DATE_FOLDER'
            }
        }

        stage('Copy Files to Server') {
            steps {
                sshagent (credentials: [env.SSH_CRED_ID]) {
                    sh '''
                        echo "[INFO] Copying dist/$DATE_FOLDER to $REMOTE_USER@$SERVER_IP:$REMOTE_DIR/"
                        scp -r dist/$DATE_FOLDER "$REMOTE_USER@$SERVER_IP:$REMOTE_DIR/"
                    '''
                }
            }
        }

        stage('Run Deploy Script on Server') {
            steps {
                sshagent (credentials: [env.SSH_CRED_ID]) {
                    sh '''
                        echo "[INFO] Running deploy script on server..."
                        ssh $REMOTE_USER@$SERVER_IP "bash $REMOTE_DIR/deploy-frontend.sh $DATE_FOLDER"
                    '''
                }
            }
        }
    }
}
