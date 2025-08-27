pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                // Cloner le repo Github
                git branch: 'main', url: 'https://github.com/copeihsinoc/CalculatriceJenkins'
            }
        }

        stage('Construire et tester') {
            steps {
                // Construire l'image Docker
                bat "docker build --no-cache -t calculatrice ."

                // Supprimer le container de test s’il existe
                bat "docker rm -f calculatrice-test || true"

                // Lancer le container temporaire pour les tests
                bat "docker run -d --name calculatrice-test calculatrice"
            }
        }

        stage('Déployer en production') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    // Pause pour demander confirmation à l'utilisateur
                    def userInput = input(message: 'Voulez-vous déployer en production ?', parameters: [
                        choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
                    ])

                    def choix = userInput.get('CHOIX')
                    if ("Oui".equals(choix)) {
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

                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                } // ferme script
            }
        }
    }
}
