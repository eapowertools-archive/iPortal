# Governed Self Service Settings Configuration Guide

This is a step-by-step setup guide for the QMC settings in your Governed Self-Service Reference Deployment.   It is recommended you start from a new deployment in a test or local environment in order to fully replicate this deployment.  There are other installation components required to install and configure the complete GSS Reference Deployment. See the Qlik Community called Governed Self-Service for more details.   

Throughout this guide you will use the Qlik Management Console to create the following objects/resources:

* Tags
* Custom properties
* Streams
* User & Login Access Rules
* Security Rules

A definition of each object/resource is provide along with a step-by-step configuration guide.  Where appropriate, a detail explanation of the configuration and it’s purpose within the governed self service deployment is provided.

> Click [here](./Governed Self-Service Settings.xlsx) to download an Excel file containing the Goverened Self-Service Configuration settings. 

# Create Tags

Tags are simply labels attached to objects within the QMC for the purpose of identification or to provide other information about an object.  The QMC user interface allows you to sort and/or filter objects and resources using these tags.  We will be using them to easily located resources that we add, modify or disable as part of this configuration.  

Create the following tags using the step-by-step instructions provided below:

1. **Custom – Disabled**
2. **Custom Rule**
3. **iPortal User**
4. **PowerTool**

## Step-by-step Instructions

1. In the left navigation pane on the QMC Home/Start page, click on **Tags** in the **Manage Resources** section to open the tags management page. 
2. Click on the **Create new** button located near the bottom of the page.
3. Enter the *Name* of your new tag.  NOTE: We will associate these tags to resources later; for now, there will be no associated items for your new tags.
4. Click the **Apply** button located near the bottom of the page to save your changes.
5. Click the **Add another** button and return to **step #3** until you have created all of the tags listed above.

#Create Customer Properties

Custom Properties are metadata that can be associated to resource types within the QMC.  Each custom property contains a list of possible values.  For example, you could create a custom property named *ReleaseStage* that contains the values *Development*, *Testing* and *Production* and associate it with the Apps resource.  Custom properties are primarily used to configure security rules using metadata rather than explicit values.  For example, you could configure a security rule that restricts access to Apps with a *ReleaseStage* of *Development* to Users with a *QlikFunction* of *Developer*. 

Create the following custom properties using the step-by-step instructions provided below:

1. **AppLevelMgmt**
    * *Resource Types*: Apps, Users
    * *Values*: Executive, HR, PCI
2. **DataConnectionType**
    * *Resource Types*: Data connections
    * *Values*: Admin, Folder, MS Access, ODBC, Oracle, PowerToolQVD, QVD, SQL Server
3. **ManagedMasterItems**
    * *Resource Types*: Apps
    * *Values*: Customer Service, Finance, Marketing, Sales
4. **QlikGroup**
    * *Resource Types*: Apps, Data connections, Reload tasks, Streams
    * *Values*: Finance, IT, Marketing, QlikAdmin, Sales

## Step-by-step Instructions

1.	In the left navigation pane on the QMC Home/Start page, click on **Custom properties** in the **Manage Resources** section to open the custom properties management page. 
2.	Click on the **Create new** button located near the bottom of the page.
3.	Enter the *Name* of your new custom property.
4.	Enable each *Resource Type* that is to be associated with the new custom property by clicking on the checkbox.
5.	Click the **Create new** button in the *Values* section and type in a value.  Repeat this step until all of the values have been created.
6.	Click the **Apply** button located near the bottom of the page.
7.	Click the **Add another** button and return to **step #3** until you have created all of the custom properties listed above.

#Create Streams

Streams allow you to group applications together for administrative purposes.  This eliminates the need to apply certain settings and authorization rules to each App individually.

A stream enables users to read and/or publish Apps, Sheets, and Stories. Users who have publish access to a stream, create the content for that specific stream. The stream access pattern in a Qlik Sense site is determined by the security rules for each stream. By default, Qlik Sense includes two streams: Everyone and Monitoring apps. An app can be published to only one stream. To publish an app to another stream, the app must first be duplicated and then published to the other stream.

Create the following streams using the step-by-step instructions provided below:

1. **Sales**
2. **Marketing**
3. **Finance**

## Step-by-step Instructions

1.	In the left navigation pane on the QMC Home/Start page, click on **Streams** in the **Manage Content** section to open the streams management page. 
2.	Click on the **Create new** button located near the bottom of the page.
3.	Enter the *Name* of your new stream.
4.	Click the **Apply* button located near the bottom of the page to save your changes.  When the Create security rule window is displayed, click the button to continue.  You will create security rules in the next section.
5.	Click the **Add another** button and return to **step #3** until you have created all of the streams listed above.

#Create User and Login Access Rules

User and Login Access Rules define which users will automatically be allocated a license token when logging into Qlik Sense.  A *user access rule* allocates a license token to a **named user** whereas a *login access rule* allocates a **login access pass** that allows a user to access Qlik Sense for a predefined amount of time.  Please refer to Qlik Sense online help for more details on login access passes.

The access rules created in this section will leverage a user’s security group membership (imported via the user directory connector) to automatically grant access.  If the user is a member of the **QlikSenseUserAccess** group, they will be granted a named user license token.  If the user is a member of the **QlikSenseLoginAccess** group, they will be granted a login access pass.  These rules allow you to control the license type of users from outside of Qlik Sense.

> You can allocate any number of tokens you wish in the login access rule, just make sure you allocate enough to support your access requirements for users in the **QlikSenseLoginAccess** group.

> However, there is no requirement to use login access users at all, they are only provided for demonstration purposes.  If you do not wish to use login access tokens, simply do not add users to the **QlikSenseLoginAccess** group.  If you are using the iPortal for testing & demonstrating governed self service, remember to edit the “group” attribute for each user in the Excel UDC file to be **QlikSenseUserAccess**.

Create the *user access rule* and *login access rule* by following the step-by-step instructions below:

1.	In the left navigation pane on the QMC Home/Start page, click on **License and tokens** in the **Manage Resources** section to open the license management page. 
2.	Click on the **User access rules** tab on the right side of the page.
3.	Click on the **Create new** button located near the bottom of the page.
4.	Click on the **Basic** properties tab on the right side of the page.  A small checkmark will be displayed on the tab and the **Basic** section of the form will now be visible.
5.	Enter **_gss – User Access Token Rule** as the *Name* of the user access rule.
6.	In the **Basic** section of the form, configure the rule such that **user group** is equal to the **value** of **QlikSenseUserAccess**. 
7.	Click the **Apply**  button located near the bottom of the page to save your changes.  
8.	Click on the **License usage summary** breadcrumb near the top of the page. 
9.	Click on the **Login access rules** tab on the right side of the page.
10.	Click on the **Create new** button located near the bottom of the page.
11.	Enter **_gss – Login Access Token Rule** as the *Name* of the login access rule.
12.	Enter **10** (or your desired number of allocated tokens) in the *Allocated tokens* field.
13.	Click the **Apply** button located near the bottom of the page to save your changes.  
14.	You will be presented with the **Create license rule** popup window.  In the **Basic** section of the form, configure the rule such that **user group** is equal to the **value** of **QlikSenseLoginAccess**.

#Disable Default Security Rules

The Qlik Sense system includes an attribute-based security rules engine that uses rules as expressions to evaluate what type of access a user or users should be granted for a resource.

In this section you will disable some default security rules that are provided with the standard Qlik Sense installation - they will be replaced with new custom security rules.  You could just edit the default security rules, but we recommend you follow the best practice guideline of disabling default rules and creating new rules. This allows you to retain the default rules just in case you would like to reference or revert to them in the future.

Disable the following security rules using the step-by-step instructions provided below:
* **ContentAdmin**
* **ContentAdminQmcSections**
* **CreateApp**
* **CreateAppObjectsPublishedApp**
* **DataConnection**
* **Stream**

## Step-by-step Instructions

1.	In the left navigation pane on the QMC Home/Start page, click on **Security rules** in the **Manage Resources** section to open the security rules management page. 
2.	For each of the security rules list above, locate the rule in the list of rules and double-click on the row.  Alternatively, you can single click on the row and click on the **Edit** button located near the bottom of the page.  
3.	In the *Identification* section of the *security rule form*, click on the **Disabled** checkbox.  
4.	Click on the **Tags** field and select *Custom – Disabled* from the dropdown.
5.	Click the **Apply** button located near the bottom of the page to save your changes.  
6.	Click on the **Security rules** breadcrumb near the top of the page.
7.	Repeat **steps #2 through #6** for each of the security rules list above.

#Create customer Security Rules

The Qlik Sense system includes an attribute-based security rules engine that uses rules to evaluate what type of access a user or users should be granted for a resource.

In this section you will create new security rules to replace and augment those rules disabled in the previous section.  Each new security rule includes a brief description of the rule and its effect on the implementation.

> The security rules defined below use a prefix (_gss) in the security rule’s names.   The “gss” portion of the prefix would normally be your company name or abbreviation.   You can leave this as is or replace it with your own prefix, it will not impact the functioning of the rules.

Create the following security rules using the step-by-step instructions provided below:

1. Name: **_gcc – Create App**
    * Description: Allows Developers and Designers to create and publish apps/sheets
    * Actions: Create, Read, Update, Delete, Export, Publish
    * Resource filter: App*
    * Conditions:   
    ```      
            (
                user.group=”QlikRootAdmin” 
                or user.roles=”RootAdmin” 
                or user.group=”QlikDeveloper” 
                or user.group=”QlikDesigner”
            )             
            and resource.owner = user
    ```
    * Context: Only in hub
    * Tags: Custom Rule
    
2. Name: **_gcc – CreateAppObjectsPublishedApp**
    * Description: Allows users to create app objects of all types on a published app, except for Consumers, who cannot create sheets.
    * Actions: Create
    * Resource filter: App.Object_*
    * Conditions:
    ``` 
            !resource.App.stream.Empty() 
            and resource.App.HasPrivileage(“read”) 
            and (	
                resource.objectType = “userstate” 
                or (
                    resource.objectType = “sheet” 
                    and user.group != “QlikConsumer”
                   ) 
                or resource.objectType = “story” 
                or resource.objectType = “bookmark” 
                or resource.objectType = “snapshot” 
                or resource.objectType = “embeddedsnapshot” 
                or resource.objectType = "hiddenbookmark"
                ) 
            and !user.IsAnonymous()
    ```
    * Context: Both in hub and QMC
    * Tags: Custom Rule
    
3. Name: **_gcc – DataConnection Create**
    * Description: Allow users to create data connections except of type folder.
    * Actions: Create, Read, Update, Delete
    * Resource filter: DataConnection_*
    * Conditions:
    ``` 
            user.group=”QlikDeveloper” 
            or user.group=”QlikTeamAdmin” 
            or user.group=”QlikRootAdmin”
    ```
    * Context: Both in hub and QMC
    * Tags: Custom Rule
    
4. Name: **_gcc – DataConnection Read**
    * Description: Allow user to read QVD type data connection if they are a Designer.
    * Actions: Read
    * Resource filter: DataConnection_*
    * Conditions:
    ```             
                (
                    user.group=”QlikDesigner” 
                    and resource.@DataConnectionType=”QVD”
                ) 
                or 
                (
                    user.group=”QlikDeveloper” 
                    or user.group=”QlikRootAdmin” 
                )
    ```
    * Context: Only in hub
    * Tags: Custom Rule

5. Name: **_gcc – Group Access Rule**
    * Description: Allow user access to read for all resources matching the user’s security group value.
    * Actions: Read
    * Resource filter: App*, Stream*
    * Conditions:
    ``` 
            user.group=resource.@QlikGroup
    ```
    * Context: Both in hub and QMC
    * Tags: Custom Rule

6. Name: **_gcc – Publishing Rights by Role**
	* Description: Allow Contributors, Designers and Developers to publish to streams.  
	* Actions: Publish
	* Resource filter: Stream_*
	* Conditions:
    ```             
            (	
                user.group = “QlikRootAdmin” 
                or user.group=”QlikContributor” 
                or user.group=”QlikDeveloper” 
                or user.group=”QlikDesigner” 
            )            
            And
            (	
	            user.group=resource.@QlikGroup 
            )
    ```
	* Context: Both in hub and QMC
	* Tags: Custom Rule
	
7. Name: **_gcc – Root Admin Group Rule**
	* Description: Allow all access to any user that is a member of the group QlikRootAdmin.
	* Actions: Create, Read, Update, Delete, Export, Publish, Change owner, Change role, Export data
	* Resource filter: *
	* Conditions:
    ```             
            user.group=”QlikRootAdmin” 
            or user.roles=”RootAdmin”
    ```
	* Context: Both in hub and QMC
	* Tags: Custom Rule
	
8. Name: **_gcc – Stream Rule – Apps Default Rule**
	* Description: Allow users to see/read resources if they have read access to the stream it is published to.
    * Actions: Read
    * Resource filter: App*
    * Conditions:
    ``` 
            (
                resource.resourcetype = “App” 
                and resource.stream.HasPrivelage(“read”) 
                and resource.@AppLevelMgmt.empty() 
            ) 
            or
            ( 
                (
                    resource.resourcetype = “App.Object” 
                    and resource.published = true” 
                    and resource.objectType != “app_appscript” 
                ) 
                and resource.app.stream.HasPrivelage(“read”) 
            )
    ```
    * Context: Both in hub and QMC
    * Tags: Custom Rule

9. Name: **_gcc – Stream Rule – Apps Exception Rule**
    * Description: Allow users to see apps with exception properties if they also have the same exception properties at the user level.
    * Actions: Read
    * Resource filter: App*
    * Conditions:
    ``` 
            resourse.stream.HasPrivilege(“read”) 
            and             
            user.@AppLevelMgmt=resource.@AppLevelMgmt
    ```
    * Context: Both in hub and QMC
    * Tags: Custom Rule

10. Name: **_gcc – TeamAdmin QMC Sections**
    * Description: Allow users the QlikTeamAdmins group to have the same rights as users in the Qlik Role “QlikTeamAdmin”.
    * Actions: Read
    * Resource filter: QmcSection_App, QmcSection_DataConnection, QmcSection_ContentLibrary,QmcSection_App.Object, QmcSection_Task, QmcSection_ReloadTask, QmcSection_Event, QmcSection_SchemaEvent, QmcSection_CompositeEvent
    * Conditions:
    ``` 
	        user.group=”QlikTeamAdmin”
    ```
    * Context: Only in QMC
    * Tags: Custom Rule
	
11. Name: **_gcc – TeamAdmin Read Rights**
    * Description: Grants rights to resources for Team Admins.   It has to be separate from the QMCSections rule for Team Admins, as they operate on different resources.
    * Actions: Create, Read, Update, Delete, Export, Publish
    * Resource filter: Stream*, App*, ReloadTask*, SchemaEvent*, Tag*, CompositeEvent*, ExecutionResult*, CustomProperty*
    * Conditions:
    ```             	
            user.group=”QlikTeamAdmin” 
            and user.group=resource.@QlikGroup
    ```
    * Context: Only in QMC
    * Tags: Custom Rule

12. Name: **_gcc - TeamAdmin Create Rights**
    * Description: Grant rights to create Tasks, Tags and Custom Properties for Team Admins.   The "read" version of this rule will already limit users to creating these things on objects in their group designation only.
    * Actions: Create, Read
    * Resource filter: Task*, ReloadTask*, Tag*, CustomProperty*
    * Conditions:
    ```
	        user.group="QlikTeamAdmin"
    ```
    * Context: Only in QMC
    * Tags: Custom Rule        

## Step-by-step Instructions

1.	In the left navigation pane on the QMC Home/Start page, click on **Security rules** in the **Manage Resources** section to open the security rules management page. 
2.	Click on the **Create new** button located near the bottom of the page.
3.	Enter the *Name* of your new security rule in the Identification section of the form.
4.	Enter the *Description* in the **Identification** section of the form.
5.	Check or uncheck the appropriate *Actions* in the **Basic** section of the form.
6.	Enter the *Resource filter* in the **Advanced** section of the form.
7.	Enter the *Conditions* in the **Advanced** section of the form.
8.	Select the appropriate *Context* in the **Advanced** section of the form.
9.	Add the appropriate *Tag(s)* in the **Tags** section of the form.
10.	Click the **Apply** button located near the bottom of the page to save your changes.  
11.	Click the **Add another** button and return to step #3 until you have created all of the security rules listed above.
