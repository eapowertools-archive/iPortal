# iPortal Installation 

The iPortal application is an easy-to-use tool that allows you to impersonate various users in a Qlik Sense Enterprise deployment.  **It is not intended for production environments.**

Click [here](https://github.com/eapowertools/iPortal/releases/download/RC4/iPortal_Setup.exe) to download the most recent iPortal installer.  The fully automated installer will:  

* Install the iPortal application on a Qlik Sense server
* Configure the Qlik Sense service dispatcher to automatically run the iPortal application
* Add & configure a Qlik Sense virtual proxy for the iPortal application
* Add & configure a Qlik Sense user directory connector for the iPortal users

Additional configuration rules are required to control iPortal users access to resources.  These rules are not covered in this installation guide.  Please refer to the [GSS Setup Guide](docs/gss_setup_guide.md) for more information.

For documentation on setting up a local development environment for iPortal, click [here](docs/dev_env_setup_guide.md)