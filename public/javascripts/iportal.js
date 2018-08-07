//
// Document Ready Initialization
//
$(document).ready(function () {
    var table = $('#iPortalUsers').DataTable({
        "paging":   false,
        "info":     false,
        "order": [[ 1, "asc" ]],
        stateSave: true,        
    });    
    
    $('a.toggle-desc-column').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column(3);

        var data = sessionStorage.getItem('colDescriptionShow');        
        if (data === "true") {            
            column.visible(false);
            $('#colDesc').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colDescriptionShow',"false");
        } else {
            column.visible(true);
            $('#colDesc').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colDescriptionShow',"true");
        }        
    } );

    $('a.toggle-corp-column').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column(4);

        var data = sessionStorage.getItem('colCorporateShow');        
        if (data === "true") {            
            column.visible(false);
            $('#colCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colCorporateShow',"false");
        } else {
            column.visible(true);
            $('#colCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colCorporateShow',"true");
        }        
    } );

    $('a.toggle-qlik-column').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column(5);

        var data = sessionStorage.getItem('colQlikShow');        
        if (data === "true") {            
            column.visible(false);
            $('#colQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colQlikShow',"false");
        } else {
            column.visible(true);
            $('#colQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colQlikShow',"true");
        }      
    } );

    $('a.toggle-license-column').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column(6);

        var data = sessionStorage.getItem('colLicenseShow');        
        if (data === "true") {            
            column.visible(false);
            $('#colLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colLicenseShow',"false");
        } else {
            column.visible(true);
            $('#colLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('colLicenseShow',"true");
        }      
    } );

    $('a.toggle-corp-groups').on( 'click', function (e) {
        e.preventDefault();

        var data = sessionStorage.getItem('groupCorporateShow');        
        if (data === "true") {
            $('.corp-panel-groups').hide();
            $('#grpCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupCorporateShow', 'false');
        } else {
            $('.corp-panel-groups').show();
            $('#grpCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupCorporateShow', 'true');
        }
    } );

    $('a.toggle-qlik-groups').on( 'click', function (e) {
        e.preventDefault();

        var data = sessionStorage.getItem('groupQlikShow');        
        if (data === "true") {
            $('.qlik-panel-groups').hide();
            $('#grpQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupQlikShow', 'false');
        } else {
            $('.qlik-panel-groups').show();
            $('#grpQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupQlikShow', 'true');
        }
    } );

    $('a.toggle-license-group').on( 'click', function (e) {
        e.preventDefault();

        var data = sessionStorage.getItem('groupLicenseShow');
        if (data == "true") {
            $('.lic-panel-groups').hide();            
            $('#grpLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupLicenseShow', 'false');
        } else {
            $('.lic-panel-groups').show();            
            $('#grpLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
            sessionStorage.setItem('groupLicenseShow', 'true');
        }
    } );    

    //
    // Initialize display state of group columns
    //
    var showDesc = sessionStorage.getItem('colDescriptionShow');    // Get current configuration from session
    var column = table.column(3);         
    if (showDesc === null) {                                        // If no session value, get configuration default
        showDesc = cfg.showDescriptionColumn;
    }

    if (showDesc == 'true') {
        sessionStorage.setItem('colDescriptionShow', 'true');
        $('#colDesc').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        column.visible( true );
    } else {
        sessionStorage.setItem('colDescriptionShow', 'false');
        column.visible( false );        
    }

    var showCorp = sessionStorage.getItem('colCorporateShow');      // Get current configuration from session
    var column = table.column(4);         
    if (showCorp === null) {                                        // If no session value, get configuration default
        showCorp = cfg.showCorporateColumn;
    }

    if (showCorp == 'true') {
        sessionStorage.setItem('colCorporateShow', 'true');
        $('#colCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        column.visible( true );
    } else {
        sessionStorage.setItem('colCorporateShow', 'false');
        column.visible( false );        
    }

    var showQlik = sessionStorage.getItem('colQlikShow');           // Get current configuration from session
    column = table.column(5);         
    if (showQlik === null) {                                        // If no session value, get configuration default
        showQlik = cfg.showQlikColumn;
    } 

    if (showQlik == 'true') {
        sessionStorage.setItem('colQlikShow', 'true');
        $('#colQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        column.visible( true );
    } else {
        sessionStorage.setItem('colQlikShow', 'false');
        column.visible( false );        
    }

    var showLic = sessionStorage.getItem('colLicenseShow');         // Get current configuration from session
    column = table.column(6);         
    if (showLic === null) {                                         // If no session value, get configuration default
        showLic = cfg.showLicenseColumn;
    }
    
    if (showLic == 'true') {
        sessionStorage.setItem('colLicenseShow', 'true');
        $('#colLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        column.visible( true );
    } else {
        sessionStorage.setItem('colLicenseShow', 'false');
        column.visible( false );        
    }

    //
    // Initialize the display state of group buttons
    //
    var data = sessionStorage.getItem('groupCorporateShow');        // Get current configuration from session
    if (data == null) {                                             // If no session value, get configuration default
        data = cfg.showCorporateGroups;
    }

    if (data == 'true') {
        sessionStorage.setItem('groupCorporateShow', 'true');
        $('#grpCorp').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        $('.corp-panel-groups').show();            
    } else {        
        sessionStorage.setItem('groupCorporateShow', 'false');
    }

    data = sessionStorage.getItem('groupQlikShow');                 // Get current configuration from session
    if (data == null) {                                             // If no session value, get configuration default
        data = cfg.showQlikGroups;
    }

    if (data == 'true') {
        sessionStorage.setItem('groupQlikShow', 'true');
        $('#grpQlik').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        $('.qlik-panel-groups').show();            
    } else {
        sessionStorage.setItem('groupQlikShow', 'false');
    }

    data = sessionStorage.getItem('groupLicenseShow');              // Get current configuration from session
    if (data == null) {                                             // If no session value, get configuration default
        data = cfg.showLicenseGroup;
    }

    if (data == 'true') {
        sessionStorage.setItem('groupLicenseShow', 'true');
        $('#grpLic').toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        $('.lic-panel-groups').show();            
    } else {
        sessionStorage.setItem('groupLicenseShow', 'false');
    }

  });

  function show_all_group_visibility() {            
    $('.user-panel-groups').show();
 };
 
 function hide_all_group_visibility() {            
    $('.user-panel-groups').hide(); 
 };