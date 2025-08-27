pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                // Cloner le repo Github
                git branch: 'main', url: 'https://github.com/fzegh/CalculatriceJenkins.git', credentialsId: 'github-pat'
            }
        }

        stage('Construire et tester') {
            steps {
                // Construire l'image Docker sans cache
                bat 'docker build --no-cache -t calculatrice-jenkins .'

                // Lancer le container → démarre http-server + exécute test_calculatrice.js
                bat 'start /B cmd /c "npx http-server -p 8080 & sleep 2 && node test_calculatrice.js"'
            }
        }

        stage('Déployer en production') {
            steps {
                script {
                    // Poser la question : Voulez-vous déployer ?
                    def reponse = input message: 'Voulez-vous déployer ?', parameters: [
                        choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
                    ]

                    if (reponse == 'Oui') {
                        // Supprimer un ancien container prod s’il existe
                        bat 'docker rm -f mon_container_prod || true'

                        // Lancer l’appli en prod (serveur statique uniquement)
                        bat 'docker run -d --name mon_container_prod -p 8080:8080 calculatrice-jenkins npx http-server -p 8080'
                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                }
            }
        }
    }
}
