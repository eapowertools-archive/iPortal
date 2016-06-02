#[iPortal Installer](https://github.com/eapowertools/iPortal/releases/download/RC2/iPortal_Setup.exe)
The iPortal installer installs iPortal on a Qlik Sense server, configures the service dispatcher, virtual proxy, and user directory connector.  If you want to do it manually continue below.

# iPortal Installation Overview

The iPortal application is used to easily impersonate a collection of users in Qlik Sense.  **It is not intended for production environments.**  Installing iPortal involves the following sequence of steps which are described in detail later in this guide.

1. Extract the iPortal application zip file
2. Configure the Qlik Sense Service Dispatcher
3. Create a new Virtual Proxy (VP) for the iPortal application
4. Create a new User Directory Connector (UDC) for iPortal users
5. Configure a User access rule to grant iPortal users access to Qlik Sense

Additional configuration rules are required to grant iPortal users access to resources.  These rules are not covered in this installation guide.  Please refer to (TBD) for best practices on configuring security rules.

> The installation guide assumes the hostname for the Qlik Sense server is **qlikserver**.  If your Qlik Sense server hostname is different, you will need to substitute your Qlik Sense hostname name for **qlikserver** throughout this guide.  

> You will also need to edit the hostname property in [IPORTAL_INSTALL]\config\config.js to match your Window's computer name. 

> The iPortal application uses an Excel ODBC User Directory Connector to import the iPortal users. If you are installing iPortal on a clean client or server machine, you may need to install the Microsoft Access Database Engine to get the required ODBC drivers.  You can use this [link](https://www.microsoft.com/en-us/download/confirmation.aspx?id=13255&6B49FDFB-8E5B-4B07-BC31-15695C5A2143=1) to download the 32 bit drivers from Microsoft.

## Guide Conventions

**[QLIK_INSTALL]** - This is the fully qualified path for the Qlik Sense install (ex: c:\Program File\Qlik\Sense)

**[IPORTAL_INSTALL]** - This is the fully qualified path for the iPortal application install (ex: c:\Program Files\Qlik\Sense\ServiceDispatcher\Node\iPortal)

# iPortal Step-by-Step Installation Guide
1. Install [Node.js](https://nodejs.org/en/).  The Node.js Package Manager (npm) is currently required to install the iPortal application dependencies.  In the future, dependencies will automatically be installed with an installation program.   
2. Extract the iPortal zip file to the folder **[QLIK_INSTALL]\ServiceDispatcher\Node\**.  If you downloaded the zip file from GitHub, the zip file may contain a suffix (ex: iportal-master.zip).  If so, after expanding the zip file you must rename the directory to **iPortal**.
3. Open the **Windows Command Prompt** and navigate to the **[IPORTAL_INSTALL]** directory.  Enter the following command:

    ```
    npm install
    ```

4. Copy the *contents* of the file **[IPORTAL_INSTALL]\services.conf** and *paste* it into **[QLIK_INSTALL]\ServiceDispatcher\services.conf**.
5. Restart the **Qlik Sense Service Dispatcher** Windows Service.
6. Create a new *Virtual Proxy* within the Qlik Sense QMC as defined below:

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/vp_form.png?raw=true "Virtual Proxy Edit Form")

    ```
    Attributes that need to be modified in the form:
    
    Description: iPortal Virtual Proxy
    Prefix: iportal
    Session cookie header name: X-Qlik-Session-iportal
    Authentication module redirect URI: https://qlikserver:3080
    Load balancing nodes: Make sure the Central node is added
    Websocket origin white list: qlikserver
    ```
7. Select **Proxies** from the **Associated Items** tab menu on the right side of the page and select **Central** from the Node list.  Click the **Link** button to complete the action.

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/vp_associated_items.png?raw=true "Virtual Proxy Edit Form")

8. Create a new *User Directory Connector* for iPortal users within the Qlik Sense QMC as defined below: 

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/udc_excel.png?raw=true "Virtual Proxy Edit Form")
    
    ```
    Attributes that need to be modified in the form:
    
    Name: iPortal UDC
    Type: Excel (via ODBC)
    User Sync Settings: Make sure the checkbox is UNCHECKED
    User directory name: iPortal
    User table name: [Users$]
    Attributes table name: [Attributes$]
    Visible connection string: DRIVER={Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)};DBQ=C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\iPortal\udc\excel\iportal_users.xlsx
    ```

9. **Sync** the newly created iPortal UDC to load the iPortal users.

10. Add a *User access rule* to grant all users from the *iPortal* User Directory  a user access token.

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/user_access_rule.png?raw=true "Virtual Proxy Edit Form")
    
    ```
    Attributes that need to be modified in the form:
    
    Name: iPortal UDC user access rule
    BASIC: Select userDirectory from user attribute list and select iPortal for the value
    ```
    
11. Open a browser and access [https://qlikserver:3090](https://qlikserver:3080) or [https://qlikserver/iportal/hub](https://qlikserver/iportal/hub)!
