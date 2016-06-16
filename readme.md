# iPortal Installation 

iPortal is a web application that allows you to easily impersonate multiple users in a Qlik Sense Enterprise deployment.  **It is not intended for production environments.**

Click [here](https://github.com/eapowertools/iPortal/releases/download/Latest/iPortal_Setup.exe) to download the most recent installation package.  The fully automated installer will:  

* Install the iPortal web application 
* Configure the Qlik Sense service dispatcher to automatically run the iPortal web application
* Add & configure a Qlik Sense virtual proxy 
* Add & configure a Qlik Sense user directory connector 

Additional security configuration is required to fully enable the Governed Self Service reference deployment.  Please refer to the [GSS Setup Guide](docs/gss_setup_guide.md) for more information.

For documentation on setting up a local iPortal development environment, click [here](docs/dev_env_setup_guide.md)
