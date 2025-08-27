pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                // On clone le repo Github
                git branch: 'main', url: 'https://github.com/fzegh/CalculatriceJenkins.git', credentialsId: 'github-pat'
            }
        }

        stage('Construire et tester') {
            steps {
                    // Construire l'image
                     sh 'docker build --no-cache -t calculatrice-jenkins .'

                    // Lancer le container → il démarre http-server + exécute test_calculatrice.js
                    sh 'npx http-server -p 8080 & sleep 2 && node test_calculatrice.js'

                }
            }
        }

        stage('Déployer en production') {
            steps {
                    // Poser la question : Voulez-vous déployer ? Oui/Non

                    input message: 'Voulez-vous déployer ?', parameters: [
            choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
        ]


              
                    // Supprimer un ancien container prod s’il existe
              sh 'docker rm -f mon_container_prod || true'
                    // Lancer l’appli en prod (pas les tests, juste le serveur statique)
                    sh 'docker run -d  --name mon_container_prod -p 8080:8080 calculatrice-jenkins npx http-server -p 8080'



                }
            }
        }
    

