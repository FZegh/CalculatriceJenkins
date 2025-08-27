pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/FZegh/CalculatriceJenkins'
                // Cloner le repo Github
            }
        }

        stage('Construire et tester') {
            steps {
                // Construire l'image Docker
                bat "docker build --no-cache -t calculatrice ."

                // Supprimer le container de test s’il existe
                bat "docker rm -f calculatrice-test || true"

                // Lancer le container temporaire pour les tests
                bat "docker run --name calculatrice-test calculatrice"
            }
        }

        stage('Déployer en production') {
            when {
                expression {currentBuild.result == 'SUCCESS' }
            }
            steps {
                //input message: 'Voulez-vous déployer en production ?', ok:'Oui'
                
                script {
                    // Pause pour demander confirmation à l'utilisateur
                    Poser la question : Voulez-vous déployer ? Oui/Non
                    input(message: 'Voulez-vous déployer en production ?', ok: 'Oui')

                    
                        echo "🚀 Déploiement en cours..."

                        // Supprimer l'ancien container prod s’il existe
                        bat "docker rm -f calculatrice-prod || true"

                        // Lancer le container prod
                        try {
                            bat "docker run -d --name calculatrice-prod -p 8081:8080 calculatrice"
                            echo "✅ Déploiement terminé avec succès sur le port 8081"
                        } catch (err) {
                            echo "❌ Déploiement échoué : ${err}"
                            currentBuild.result = 'FAILURE'
                        }
            }
        }
    }
}
}