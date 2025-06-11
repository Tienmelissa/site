import os
import re

def update_html_files(directory):
    css_content = """
.rotating-logo {
    transition: transform 0.5s ease-in-out;
}

.rotating-logo:hover {
    transform: rotate(360deg);
}
"""

    js_content = """
// Ajoute la classe rotating-logo à tous les logos
const logos = document.querySelectorAll('.nav-logo img, .footer-logo img');
logos.forEach(logo => {
    logo.classList.add('rotating-logo');
});
"""

    for filename in os.listdir(directory):
        if filename.endswith('.html'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()

            # Ajouter le CSS dans le head
            head_start = content.find('<head>')
            if head_start != -1:
                head_end = content.find('</head>')
                new_content = content[:head_start + len('<head>')]
                new_content += '\n    <link rel="stylesheet" href="logo-animation.css">\n    <style>\n    ' + css_content + '\n    </style>\n'
                new_content += content[head_end:]

                # Ajouter le JS avant la fermeture du body
                body_end = new_content.rfind('</body>')
                if body_end != -1:
                    new_content = new_content[:body_end] + '\n    <script>\n    ' + js_content + '\n    </script>\n' + new_content[body_end:]

                # Écrire le nouveau contenu
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)

if __name__ == "__main__":
    update_html_files('c:\\Users\\HP\\Videos\\PROJET-Web-1')
