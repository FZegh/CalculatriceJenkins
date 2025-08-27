pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/fzegh/CalculatriceJenkins.git'
            }
        }

        stage('Construire et tester') {
            steps {
                bat 'docker build --no-cache -t calculatrice-jenkins .'
                bat docker run CalculatriceJenkins "npx http-server -p 8080 & timeout /t 2 & node test_calculatrice.js"'
            }
        }

        stage('Déployer en production') {
            steps {
                script {
                    // Vérifier si le container existe déjà
                    def containerExiste = bat(script: 'docker ps -a --format "{{.Names}}" | findstr mon_container_prod', returnStatus: true) == 0
                    if (containerExiste) {
                        echo "Un container existant nommé 'mon_container_prod' a été trouvé."
                    } else {
                        echo "Aucun container existant trouvé."
                    }

                    // Poser la question à l'utilisateur
                    def reponse = input message: 'Voulez-vous déployer ?', parameters: [
                        choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
                    ]

                    if (reponse == 'Oui') {
                        if (containerExiste) {
                            bat 'docker rm -f mon_container_prod'
                        }
                        bat 'docker run -d --name mon_container_prod -p 8080:8080 calculatrice-jenkins npx http-server -p 8080'
                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                }
            }
        }
    }
}
