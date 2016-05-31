[Setup]
WizardImageFile=userdocs:_Git\qscustomproploader\Install\PowerToolsLogoNew.bmp
WizardSmallImageFile=userdocs:_Git\qscustomproploader\Install\PowerToolsLogoNewSmall.bmp
WizardImageBackColor=clWhite
WizardImageStretch=False
AlwaysShowDirOnReadyPage=True
AppName=iPortal
AppVersion=1.0.0.0
AppId={{3AA4FFBA-831E-4622-AB76-F30446121EB2}
SetupIconFile=userdocs:_Projects\favicon.ico
DefaultDirName=C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\iportal
DisableDirPage=no
DisableWelcomePage=no
UsePreviousAppDir=False
AllowUNCPath=False
AppendDefaultDirName=False
UsePreviousGroup=False
DisableProgramGroupPage=yes
CloseApplications=False
RestartApplications=False
CreateUninstallRegKey=no
UninstallDisplayName=iPortal
UninstallDisplayIcon={uninstallexe}
VersionInfoVersion=1.0.0.0
VersionInfoCompany=EA Team,
VersionInfoDescription=iPortal by Eric Bracke & Enterprise Architecture team
OutputDir=F:\My Documents\_Git\iportal\Install
ArchitecturesInstallIn64BitMode=x64
RestartIfNeededByRun=False
AllowCancelDuringInstall=True
TimeStampsInUTC=True
Compression=lzma
SolidCompression=yes
OutputBaseFilename = iPortal_Setup

[Files]
Source: "F:\My Documents\_Git\iportal\package.json"; DestDir: "{app}";
Source: "F:\My Documents\_Git\iportal\readme.md"; DestDir: "{app}";
Source: "F:\My Documents\_Git\iportal\server.js"; DestDir: "{app}";
Source: "F:\My Documents\_Git\iportal\app.js"; DestDir: "{app}";
Source: "F:\My Documents\_Git\iportal\config\*"; DestDir: "{app}\config"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\lib\*"; DestDir: "{app}\lib"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\routes\*"; DestDir: "{app}\routes"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\udc\*"; DestDir: "{app}\udc"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\views\*"; DestDir: "{app}\views"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\public\*"; DestDir: "{app}\public"; Flags: ignoreversion createallsubdirs recursesubdirs;
Source: "F:\My Documents\_Git\iportal\utils\*"; DestDir: "{app}\utils"; Flags: ignoreversion createallsubdirs recursesubdirs;


[Dirs]
Name: "{app}\log"; Flags: uninsalwaysuninstall;

[Code]
const
  size = 9;
  codes64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
type
  a = array[1..6] of array[1..2] of string;
var
  configPage: TInputQueryWizardPage;
  Page: TWizardPage;
  AccessDriversPage: TWizardPage;
  serviceConfLookup: TInputFileWizardPage;
  forceClose : Boolean;
  configArray: a;
  masterLabel, engineLabel, repoLabel, hostnameLabel, virtualProxyLabel, allowedConnectionsLabel, udLabel : TLabel ;
  createVPLabel : TLabel;
  masterField, engineField, repoField, hostnameField, virtualProxyField, allowedConnectionsField, udField : TNewEdit;
  idField, appField, cpField, taskField : TNewEdit;
  driversStatic: TNewMemo;
  URLLabel: TNewStaticText;
  MLEMessage: string;
  createVirtualProxyCB : TNewCheckBox;
  appPath, executePath, fullPath, errorString: String;
  chPath, cvpPath, checkHostNamePath, checkVPExistPath: String;


  
  procedure Explode(var Dest: TArrayOfString; Text: String; Separator: String);
var
  i, p: Integer;
begin
  i := 0;
  repeat
    SetArrayLength(Dest, i+1);
    p := Pos(Separator,Text);
    if p > 0 then begin
      Dest[i] := Copy(Text, 1, p-1);
      Text := Copy(Text, p + Length(Separator), Length(Text));
      i := i + 1;
    end else begin
      Dest[i] := Text;
      Text := '';
    end;
  until Length(Text)=0;
end;


function getPath(InstallPath, EndNode: String) : String;
var 
  OutputList: TArrayOfString;
  str: String;
  i: Integer;
begin
    Explode(OutputList,InstallPath,'\');
      for i:= 0 to GetArrayLength(OutputList)-1 do
      begin
          if(OutputList[i] = EndNode) then
          begin
            str := str + OutputList[i] + '\';
            Break;
          end
          else begin
            str := str + OutputList[i] + '\';
          end
      end;
      Result := str;
end;

function Decode64(S: AnsiString): AnsiString;
var
	i: Integer;
	a: Integer;
	x: Integer;
	b: Integer;
begin
	Result := '';
	a := 0;
	b := 0;
	for i := 1 to Length(s) do
	begin
		x := Pos(s[i], codes64) - 1;
		if x >= 0 then
		begin
			b := b * 64 + x;
			a := a + 6;
			if a >= 8 then
			begin
				a := a - 8;
				x := b shr a;
				b := b mod (1 shl a);
				x := x mod 256;
				Result := Result + chr(x);
			end;
		end
	else
		Exit; // finish at unknown
	end;
end;

  procedure InitializeWizard;
begin
  { Create the pages }
   Page := CreateCustomPage(wpInstalling, 'QS Ticket Epic Module', 
   'Please confirm or change the following configuration defaults for the QS Ticket Epic Module.');
  
  //Page.OnNextButtonClick := @NextButtonClick;
  //0  
  masterLabel := TLabel.Create(Page);
  masterLabel.Top := 11;
  masterLabel.Width := 8;
  masterLabel.Caption := 'iPortal port:';
  masterLabel.Parent := Page.Surface;

  //1
  masterField := TNewEdit.Create(Page);
  masterField.Left := masterLabel.Width + 5;
  masterField.Top := 8;
  masterField.Width := 36;
  masterField.Text := IntToStr(3090);
  masterField.Parent := Page.Surface;

  //2
  repoLabel := TLabel.Create(Page);
  repoLabel.Top := 11;
  repoLabel.Left := masterField.Left + masterField.Width + 10;
  repoLabel.Width := 8;
  repoLabel.Caption := 'Qlik Sense Proxy service port:';
  repoLabel.Parent := Page.Surface;

  //3
  repoField := TNewEdit.Create(Page);
  repoField.Left := repoLabel.Left + repoLabel.Width + 5;
  repoField.Top := 8;
  repoField.Width := 36;
  repoField.Text := IntToStr(4243);
  repoField.Parent := Page.Surface;

  //4
  hostnameLabel := TLabel.Create(Page);
  hostnameLabel.Top := 40;
  hostnameLabel.Width := 8;
  hostnameLabel.Caption := 'Qlik Sense hostname:';
  hostnameLabel.Parent := Page.Surface;

  //5
  hostnameField := TNewEdit.Create(Page);
  hostnameField.Left := 194;
  hostnameField.Top := 37;
  hostnameField.Width := 200;
  //hostnameField.Text := '';
  hostnameField.Parent := Page.Surface;

  //6
  virtualProxyLabel := TLabel.Create(Page);
  virtualProxyLabel.Top := hostnameLabel.Top + 29;
  virtualProxyLabel.Width := 8;
  virtualProxyLabel.Caption := 'Qlik Sense virtual proxy prefix:';
  virtualProxyLabel.Parent := Page.Surface;

  //7
  virtualProxyField := TNewEdit.Create(Page);
  virtualProxyField.Left := 194;
  virtualProxyField.Top := hostnameField.Top + 29;
  virtualProxyField.Width := 200;
  virtualProxyField.Text := 'iportal';
  virtualProxyField.Parent := Page.Surface;

  //8 create virtual proxy check box?
  createVirtualProxyCB := TNewCheckBox.Create(Page);
  createVirtualProxyCB.Left := 194;
  createVirtualProxyCB.Top := virtualProxyLabel.Top + 29;
  createVirtualProxyCB.Width := 200;
  createVirtualProxyCB.Caption := 'Create Virtual Proxy?';
  createVirtualProxyCB.Parent := Page.Surface;

  //9
  allowedConnectionsLabel := TLabel.Create(Page);
  allowedConnectionsLabel.Top := createVirtualProxyCB.Top + 29;
  allowedConnectionsLabel.Width := 8;
  allowedConnectionsLabel.Caption := 'Allowed-Access-Control-Origin Header:';
  allowedConnectionsLabel.Parent := Page.Surface;

  //10
  allowedConnectionsField := TNewEdit.Create(Page);
  allowedConnectionsField.Left := 194;
  allowedConnectionsField.Top := createVirtualProxyCB.Top + 29;
  allowedConnectionsField.Width := 200;
  allowedConnectionsField.Text := '*';
  allowedConnectionsField.Parent := Page.Surface;

  //11
  udLabel := TLabel.Create(Page);
  udLabel.Top := allowedConnectionsLabel.Top + 29;
  udLabel.Width := 8;
  udLabel.Caption := 'user directory:';
  udLabel.Parent := Page.Surface;

  //12
  udField := TNewEdit.Create(Page);
  udField.Left := 194;
  udField.Top := allowedConnectionsField.Top + 29;
  udField.Width := 200;
  udField.Text := 'iportal';
  udField.Parent := Page.Surface;
  

  serviceConfLookup := CreateInputFilePage(Page.ID, 
    'Location of service.conf file', 
    'Please confirm the location of the services.conf file to be edited.',
    '');

    serviceConfLookup.Add('services.conf location','Conf files|*.conf|All files|*.*','.conf');
    
  
end;

function getHostName : string;
var
  FileLines: TStringList;
  FileName: string;
  lineNbr: Integer;
  Line: string;
begin
  FileName := ExpandConstant('{commonappdata}\Qlik\Sense\Host.cfg');
  FileLines := TStringList.Create;
  try
    FileLines.LoadFromFile(FileName);
    for lineNbr := 0 to 0 do
    begin
      Line:= FileLines[lineNbr];
    end
  finally
    FileLines.Free;
  end;
  Result := Line;
end;


Procedure setServerConfigFile;
var 
  lineNbr: Integer;
  i, j: Integer;
  key, value: string;
  Line: string;
  KeyPos: Integer;
  FileLines: TStringList;
  FileName: string;
begin
  FileName := ExpandConstant('{app}\config\config.js');
  FileLines := TStringList.Create;
  try
    FileLines.LoadFromFile(FileName);
    for lineNbr := 0 to FileLines.Count - 1 do
    begin
      Line:= FileLines[lineNbr];
      for i:= 1 to 6 do
      begin
        key := configArray[i][1];
        value := configArray[i][2];
        //msgbox(key + ':' + value, mbInformation, mbOk);
        if i > 2 then
        begin
          //msgbox(key + ':' + value, mbInformation, mbOk
          value := '''' + value + '''';
        end;
        KeyPos := Pos(key, Line);
        if KeyPos > 0 then
        begin
          (*found a match, now change the value *)
          Delete(Line, KeyPos + Length(key) + 1, MaxInt);
          Line := Line + value + ',';
          FileLines[lineNbr] := Line; 
        end;
      end;
    end;
    FileLines.SaveToFile(FileName);
    Log('Config.js set for this installation');
  finally
    FileLines.Free;
  end;
end;

Procedure setIPortalConfFile;
var 
  confString : string;
  filePath : string;
Begin
     confString := #13#10; 
     confString := confString + '[iportal]' + #13#10;
     confString := confString + 'Identity=iportal' + #13#10;
     confString := confString + 'Enabled=true' + #13#10;
     confString := confString + 'DisplayName=iPortal' + #13#10;
     confString := confString + 'ExecType=nodejs' + #13#10;
     confString := confString + 'ExePath=Node\node.exe' + #13#10;
     confString := confString + 'Script=Node\iportal\server.js' + #13#10;

      filePath := getPreviousData('services.conf', 'C:\Program Files\Qlik\Sense\ServiceDispatcher\services.conf');

     SaveStringToFile(filePath, confString, True); 
     
end;


Procedure remIPortalConfFile;
var 
  confString : string;
  filePath : string;
  lineNbr: Integer;
  i, j: Integer;
  key, value: string;
  Line: string;
  KeyPos: Integer;
  FileLines: TStringList;
Begin
    confString := '[iportal]';
    filePath := getPreviousData('services.conf', 'C:\Program Files\Qlik\Sense\ServiceDispatcher\services.conf');
    FileLines := TStringList.Create;
  try
    FileLines.LoadFromFile(filePath);
    for lineNbr := 0 to FileLines.Count - 1 do
    begin
      Line:= FileLines[lineNbr];
      KeyPos := Pos(confString, Line);
      if KeyPos > 0 then
      begin
      for i:= lineNbr to lineNbr + 6 do
        begin
          Line := '';
          FileLines[i] := Line; 
        end;
      end;
    end;
    FileLines.SaveToFile(filePath);
    Log('Removed iportal from the services.conf');
  finally
    FileLines.Free;
  end;
end;

procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
  Confirm:= not forceClose;
end;   

function NextButtonClick(CurPageID: Integer): Boolean;
   
var
  i,j, I: Integer;
  
  flagGo: Integer;
  ResultCode: Integer;

  Begin

  if (CurPageID = wpWelcome)  then
  begin
    hostnameField.Text := Decode64(getHostName);
  end;

  if (CurPageID = wpSelectDir) then
  begin
    appPath := getPath(ExpandConstant('{app}'),'Node') + 'node.exe'; 
    executePath := ExpandConstant('{app}') + '\utils\createVirtualProxy.js';
    checkHostNamePath := ExpandConstant('{app}') + '\utils\checkHostName.js';
    chPath:= '"' + ExpandConstant('{app}') + '\utils\checkHostName.bat"';
    checkVPExistPath := ExpandConstant('{app}') + '\utils\checkVPExist.js';
    cvpPath:= '"' + ExpandConstant('{app}') + '\utils\checkVPExist.bat"'; 
    fullPath := '"' + ExpandConstant('{app}') + '\utils\createVirtualProxy.bat"';
    serviceConfLookup.Values[0] := getPath(ExpandConstant('{app}'),'ServiceDispatcher') + 'services.conf';
    SetPreviousData(0, 'service.conf', serviceConfLookup.Values[0]);
  end;

  if (CurPageID = wpWelcome) and not (DirExists('C:\Program Files\Qlik\Sense') or DirExists('D:\Program Files\Qlik\Sense')) then
  begin
      MsgBox('Qlik Sense Server is not installed. Please install Qlik Sense before running this install.', mbCriticalError, MB_OK);
      forceClose:= True;
      WizardForm.Close;
  end;

  {this is the page for updating the services.conf}
  if(CurPageId = serviceConfLookup.ID) then
  begin
    //first update the config file
    
    setServerConfigFile;
    
    if (createVirtualProxyCB.Checked) then
    begin
      
      //MsgBox(appPath,mbInformation, MB_OK);
      //MsgBox(appPath + ' "' + executePath + '"',mbInformation,MB_OK);
      //MsgBox(fullPath,mbInformation,MB_OK);
      if ShellExec('',fullPath, '"' + appPath + '" "' + executePath + '"','', SW_SHOW, ewWaitUntilTerminated, ResultCode) then
      begin
        MsgBox('Added virtual proxy', mbInformation, MB_OK);
      end
      else begin
        MsgBox('Failed to add virtual proxy.  Virtual proxy will need to be added manually.', mbError, MB_OK);
      end;      
    end;

    if Exec(ExpandConstant('{app}\utils\stopService.bat'),'','', SW_SHOW,
     ewWaitUntilTerminated, ResultCode) then
    begin
        MsgBox('Stopped the Service Dispatcher', mbInformation, MB_OK); 
    end
    else begin
        MsgBox('Failed to Stop the Service Dispatcher', mbError, MB_OK); 
    end;
    begin
      remIPortalConfFile;
      setIPortalConfFile;
    end;

    if Exec(ExpandConstant('{app}\utils\startService.bat'),'','', SW_SHOW,
     ewWaitUntilTerminated, ResultCode) then
    begin
        MsgBox('Started the Service Dispatcher', mbInformation, MB_OK); 
    end
    else begin
        MsgBox('Failed to Start the Service Dispatcher', mbError, MB_OK); 
    end;
  end;

  flagGo := 0;
  { Validate certain pages before allowing the user to proceed }
  if (CurPageID = Page.ID) then begin
      
    if (hostnameField.Text = '') then begin
      errorString := errorString + 'Please enter a hostname.' + #13#10;
      flagGo :=1;
    end;
    //MsgBox(chPath + ' ' + '"' + appPath + '" "' + checkHostNamePath + '" ' + hostnameField.Text + ' 4242', mbInformation, MB_OK);
    if ShellExec('',chPath, '"' + appPath + '" "' + checkHostNamePath + '" ' + hostnameField.Text + ' 4242' ,'', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
       if(FileExists(ExpandConstant('{app}\utils\checkHostName.txt'))) then
       begin
          //file exists, all good
       end
       else begin
          errorString := 'The hostname you entered is not a valid Qlik Sense server hostname.  Please enter a valid hostname.';
          flagGo:=1;
       end;
    end;
    //MsgBox(cvpPath + ' ' + '"' + appPath + '" "' + checkVPExistPath + '" ' + hostnameField.Text + ' 4242 ' + virtualProxyField.Text, mbInformation, MB_OK);
    if ShellExec('',cvpPath, '"' + appPath + '" "' + checkVPExistPath + '" ' + hostnameField.Text + ' 4242 ' + virtualProxyField.Text,'', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
       if(FileExists(ExpandConstant('{app}\utils\checkVPExist.txt'))) then
       begin
          if MsgBox('The virtual proxy prefix you entered already exists. Do you want to use this virtual proxy for the iPortal?', mbConfirmation, MB_YESNO) =IDYES then
          begin
            MsgBox('You have chosen to use an existing virtual proxy.  Please ensure the authentication redirect url and port match your virtual proxy before using iPortal.', mbInformation, MB_OK);
            DeleteFile(ExpandConstant('{app}\utils\checkVPExist.txt'));
            flagGo:=0;
          end
          else begin
            MsgBox('To create a new virtual proxy, change the virtual proxy name and check the create checkbox.',mbInformation, MB_OK);
            DeleteFile(ExpandConstant('{app}\utils\checkVPExist.txt'));         
            flagGo:=1;
          end;
       end
       else begin
          MsgBox('The virtual proxy does not exist.  Check the create checkbox to create the virtual proxy.',mbInformation,MB_OK);
          flagGo:=1
       end;
    end;    
    
    if(flagGo = 0) then begin
      configArray[1][1] := 'serverPort:';
      configArray[1][2] := masterField.Text;
      configArray[2][1] := 'qpsPort:';
      configArray[2][2] := repoField.Text;
      configArray[3][1] := 'hostname:';
      configArray[3][2] := hostnameField.Text;
      configArray[4][1] := 'virtualProxy:';
      configArray[4][2] := virtualProxyField.Text;
      configArray[5][1] := 'allowedConnections:';
      configArray[5][2] := allowedConnectionsField.Text;
      configArray[6][1] := 'userDirectory:';
      configArray[6][2] := udField.Text;

                           
      Result := True;
    end else begin 
      MsgBox(errorString, mbError, MB_OK);
      Result := False;
    end;
  end else begin
    Result := True;
  end;   
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  filePath : string;
  ResultCode: Integer;
begin
  case CurUninstallStep of
    usUninstall:
    begin
      Exec(ExpandConstant('{app}\utils\stopService.bat'),'','', SW_SHOW,
     ewWaitUntilTerminated, ResultCode);
    end;
    
    usPostUninstall:
      begin
          remIPortalConfFile;
          Exec(ExpandConstant('{app}\utils\startService.bat'),'','', SW_SHOW,
          ewWaitUntilTerminated, ResultCode);
        //Remove Services.Conf definition
      {  remConfFile;}
        // ...insert code to perform post-uninstall tasks here...
      end;
  end;
end;

function createVirtualProxy: Boolean;
begin

    Result:=  createVirtualProxyCB.Checked;
end;
