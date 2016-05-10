# iPortal Installation Guide

The iPortal application is used to easily impersonate a collection of users in Qlik Sense.  **It is not intended for production environments.**  Installing iPortal involves the following sequence of steps which are described in detail later in this guide.

1. Extract the iPortal.zip file
2. Configure the Qlik Sense Service Dispatcher
3. Create a new Virtual Proxy (VP) for the iPortal application
4. Create a new User Directory Connector (UDC) for iPortal users
5. Configure a User access rule to grant iPortal users access to Qlik Sense

Additional configuration rules are required to grant iPortal users access to resources.  These rules are not covered in this installation guide.  Please refer to ... for best practices on configuring security rules.

> The installation guide assumes the Windows computer name where Qlik Sense is installed is named **qlikserver**.  If your Windows computer name is different, you will need to substitute your computer name for **qlikserver** throughout this guide.

> The installation guide provides instructions for both an Excel ODBC and ODBC (CSV) User Directory Connector for iPortal users. Both may require that you install the Microsoft Access Database Engine to get the ODBC drivers installed.  This was the case for a clean Windows Server 2012 R2 installation.

## Guide Conventions

[QLIK_INSTALL] - This is the fully qualified path for the Qlik Sense install (ex: c:\Program File\Qlik\Sense)
[IPORTAL_INSTALL] - This is the fully qualified path for the iPortal application install (ex: c:\Program Files\Qlik\Sense\ServiceDispatcher\Node\iPortal)

## Step-by-Step Installation
1. Install [Node.js](https://nodejs.org/en/).  The Node.js Package Manager (npm) is currently required to install the iPortal application dependencies.  In the future, dependencies will automatically be installed with an installation program.   
1. Extract the iPortal.zip file to the folder **[QLIK_INSTALL]\ServiceDispatcher\Node\iPortal**.  If you downloaded the zip file from GitHub, it may contain and suffix (ex: iportal-master.zip).  If so, after expanding the zip file you must to rename the directory to **iPortal**.
1. Open the **Windows Command Prompt** and navigate to the **[IPORTAL_INSTALL]** directory.  Enter the following command:

    ```
    npm install
    ```

2. Copy the *contents* of the file **[IPORTAL_INSTALL]\services.conf** and *paste* it into **[QLIK_INSTALL]\ServiceDispatcher\services.conf**.
3. Restart the **Qlik Sense Service Dispatcher** Windows Service.
4. Create a new *Virtual Proxy* within the Qlik Sense QMC as defined below:

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
5. Select **Proxies** from the **Associated Items** tab menu on the right side of the page and select **Central** from the Node list.  Click the **Link** button to complete the action.

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/vp_associated_items.png?raw=true "Virtual Proxy Edit Form")

6. Create a new *User Directory Connector* within the Qlik Sense QMC for the iPortal users.  Data files are provided for an Excel or CSV based UDC.  Instructions for creating both are provided below, you only need to configure *one*!

    ### CSV
    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/udc_csv.png?raw=true "Virtual Proxy Edit Form")

    ```
    Attributes that need to be modified in the form:
    
    Name: iPortal UDC
    Type: ODBC
    User Sync Settings: Make sure the checkbox is UNCHECKED
    User directory name: iPortal
    User table name: users.csv
    Attributes table name: attributes.csv
    Visible connection string: Driver={Microsoft Access Text Driver (*.txt, *.csv)};Extensions=asc,csv,tab,txt;Dbq=C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\iPortal\udc\csv
    ```

    ### Excel
    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/udc_excel.png?raw=true "Virtual Proxy Edit Form")
    
    ```
    Attributes that need to be modified in the form:
    
    Name: iPortal UDC
    Type: Excel (via ODBC)
    User Sync Settings: Make sure the checkbox is UNCHECKED
    User directory name: iPortal
    User table name: [Users$]
    Attributes table name: [Attributes$]
    Visible connection string: DRIVER={Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)};DBQ=C:\Progam Files\Qlik\Sense\ServiceDispatcher\Node\iPortal\udc\excel\iportal_users.xlsx
    ```

7. Add a *User access rule* to grant all users from the *iPortal* User Directory  a user access token.

    ![alt text](https://github.com/eapowertools/iPortal/blob/master/public/images/user_access_rule.png?raw=true "Virtual Proxy Edit Form")
    
    ```
    Attributes that need to be modified in the form:
    
    Name: iPortal UDC user access rule
    BASIC: Select userDirectory from user attribute list and select iPortal for the value
    ```
    
8. Open a browser and access [https://qlikserver:3080](https://qlikserver:3080) or [https://qlikserver/iportal/hub](https://qlikserver/iportal/hub)!
