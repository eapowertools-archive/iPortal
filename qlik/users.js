var xlsx = require('xlsx');             // JavaScript package for ready Excel files
var cfg = require('../qlik/config');
var log4js = require('log4js');

var logger = log4js.getLogger('iportal');

module.exports = {
    
    /*
        This function reads data from the Users and Attributes worksheets in an Excel document
        and merges it together to create a single JavaScript object used to render the list of
        users available for impersonation (views/partials/index.hbs).
        
        The Excel document is expected to be formatted such that it can be used as a Qlik Sense
        User Directory Connector (UDC). 
    */ 
    loadExcelUsers: function(fileName) {
        logger.info('loadExcelUsers: Reading Excel file (',cfg.EXCELFILEPATH,")...");
        
        /* Open workbook containing users & attributes */
        var workbook = xlsx.readFile(cfg.EXCELFILEPATH);
        
        /* Convert contents of Excel Users & Attributes file to JavaScript object */
        var xlsxUsers = {};
        var xlsxAttrs = {};
        
        /* Sheet containing users must be named 'Users' or rename key below */
        var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets['Users']);
        if (roa.length > 0){
            xlsxUsers = roa;
            logger.info('loadExcelUsers: ', roa.length, 'Users loaded.')
        } else {
            logger.warn('loadExcelUsers: No data found in Users worksheet!');
        }
        
        /* Sheet containing attributes must be named 'Attributes' or rename key below */
        var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets['Attributes']);
        if (roa.length > 0){
            xlsxAttrs = roa;
            logger.info('loadExcelUsers: ', roa.length, 'Attributes loaded.')
        } else {
            logger.warn('loadExcelUsers: No data found in Attributes worksheet!');
        }
        
        /* Create empty objects to populated from xlsx content */
        var Users = {};
        logger.debug('loadExcelUsers: Converting Excel data into JavaScript object...');
                
        /* Transform xlsx data into JavaScript object used by templating engine to render user list */
        for (var key in xlsxUsers) {            
            
            var User = {};
                    
            if (xlsxUsers.hasOwnProperty(key)) {
                var uid = xlsxUsers[key].userid;
                var name = xlsxUsers[key].name;
                
                logger.trace('loadExcelUsers: Transforming user (',name,')...');
                
                User["userid"] = uid;
                User["name"] = name;
                
                Users[key]=User;
                
                var userSpecificAttrs = xlsxAttrs.filter( function(item){return (item.userid==uid);} );
                logger.trace('loadExcelUsers: Found ',userSpecificAttrs.length,' attributes associated with user (',name,')');
            
                var userGroups = [];
                var userRoles = [];
                var userTags = [];
                var userApps = [];
                
                for(var i=0; i<userSpecificAttrs.length; i++) {
                    logger.trace('loadExcelUsers: Transforming attribute (',userSpecificAttrs[i].type,') with value (',userSpecificAttrs[i].value,')...');
                    if (userSpecificAttrs[i].type == 'group') {
                        userGroups.push(userSpecificAttrs[i].value);
                    } else if (userSpecificAttrs[i].type == 'role') {
                        userRoles.push(userSpecificAttrs[i].value);
                    } else if (userSpecificAttrs[i].type == 'tag') {
                        userTags.push(userSpecificAttrs[i].value);
                    } else if (userSpecificAttrs[i].type == 'app') {
                        userApps.push(userSpecificAttrs[i].value);
                    } else if (userSpecificAttrs[i].type == 'udc') {
                        User["udc"] = userSpecificAttrs[i].value;
                    } else if (userSpecificAttrs[i].type == 'title') {
                        User["title"] = userSpecificAttrs[i].value;
                    } else {
                        logger.trace('loadExcelUsers: Unrecognized attribute encountered (',userSpecificAttrs[i].type,') and ignored.');    
                    }                     
                }
                
                User["groups"] = userGroups;    
                User["roles"] = userRoles;
                User["tags"] = userTags;
                User["apps"] = userApps;                                            
            }
        }
        logger.info('loadExcelUsers: JavaScript object creation complete.');
        
        var config = {};
        config.users = Users;
        logger.trace('loadExcelUsers: Javascript object dump:\n',config);
	    return config;
      
    }
};
