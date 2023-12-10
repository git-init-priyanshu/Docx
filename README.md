# Google-docs-clone
A platform that replicates the collaborative and customizable features of Google Docs. Multiple users can work together in real time on documents. It offers font customization and color adjustments for a unique look. You can log in with your account, create docs, edit docs, manage docs, and share the docs with different users for collaboration. <br/>
Now with new and improved UI with many new features.

Tech Stack:
* Rect.js ( frontend )
* GraphQl ( backend )
* GraphQl - Subscriptions ( Real Time collaboration )
* TypeScript 
* Docker
* Nginx

## Website link
[Visit Website](https://docx-git-init-priyanshu.vercel.app/)

## How it works:

* You need to sign up with your email id and password.

* After signing up, you will be redirected to the home page where you can see all your documents. If you are a new user, this section will be empty, and you will need to create a new document.
  
* To create a new document, click the button on the top right corner.

* Edit your document as you like; changes will be saved automatically.

* You can share your document with others for collaboration. To do this, click on the 'Share Doc' button located under the thumbnail of each document on the home page.

* After clicking the button, send the link to your friend. They will paste the link, and both of you can then edit the same document simultaneously.

## Screenshots

  <div style="display: flex;">
    <img width="480" alt="Screenshot 2023-12-10 123504" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/ed80c831-698b-4cac-a3fb-61728f690e0e">
    <img width="480" alt="image" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/9374ba10-49af-4d1a-9290-a595be9e74b8">
  </div>
  <img width="960" alt="image" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/a958a7e2-8903-4aeb-bac8-dd155a038b20">
<img width="960" alt="image" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/14393200-d0fc-47ff-84ba-ed1ebb7e0417">
<img width="960" alt="image" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/d9181f2f-783b-4bb6-bc9d-9edc71b8d2db">
<img width="960" alt="image" src="https://github.com/git-init-priyanshu/Docx/assets/110045644/bd403f84-5e71-48fa-9aec-52ec66e7c5a4">

## Features:
* User Registration: User can Sign up using their email and password for secure access.
* Secure: Passwords are encrypted in the database.
* Real-time Editing: Collaborate with others in real time on the same Doc.
* Sharing: Share Doc with others for seamless collaboration.
* Management: The owner of the Doc can manage who has access to collaborate and who does not.

## Installation:
* You need to install Docker.
* Fork this repo.
* Open git bash and paste these commands:
  * `Git clone https://github.com/<YourGithubProfileName>/Docx.git`
  * `cd Google-docs-clone`
  * `code .`
* Open integrated terminal window and paste this command:
  * `docker compose up -d`
* Wait for the docker containers to properly start.
* Then go to `localhost:80` and start contributing.       
