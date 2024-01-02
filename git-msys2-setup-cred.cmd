@echo off

echo.Installing symlink to 'Git Credential Manager' from 'Git For Windows' into MSYS2...

set "gitbase=C:/msys64/usr/bin"
set "gcm_source=C:/Program Files/Git/mingw64/bin"
set "gcm_path=opt/git-for-windows-mingw64-bin"

set "git=%gitbase%/git.exe"
set "link_dir=C:/msys64/%gcm_path%"
set "link_target=C:/Program Files/Git/mingw64/bin"

set "gcm=/%gcm_path%/git-credential-manager"
set "gcmc=/%gcm_path%/git-credential-manager-core"

echo.  + Adding symlink to MSYS2
rmdir /Q "%link_dir%"
mklink /D "%link_dir%" "%link_target%"

echo.  + Changing git global config credential.helper...
"%git%" config --global --replace-all credential.helper "%gcm%"
@REM "%git%" config --global --replace-all "credential.https://github.com.helper" "%gcm%"
@REM "%git%" config --global --replace-all "credential.https://gist.github.com.helper" "%gcm%"
@REM "%git%" config --global --list

@REM [credential]
@REM 	helper = /%gcm_path%/git-credential-manager
@REM [credential "https://github.com"]
@REM 	helper = /%gcm_path%/git-credential-manager
@REM 	helper = !'C:\\Program Files\\GitHub CLI\\gh.exe' auth git-credential
@REM [credential "https://gist.github.com"]
@REM 	helper = /%gcm_path%/git-credential-manager
@REM 	helper = !'C:\\Program Files\\GitHub CLI\\gh.exe' auth git-credential

set "FILE=%gitbase%/git-credential-manager"
echo.  + Creating "%FILE%"
echo #!/usr/bin/env bash > %FILE%
echo %gcm% "$@" >> %FILE%

set "FILE=%gitbase%/git-credential-manager-core"
echo.  + Creating "%FILE%"
echo #!/usr/bin/env bash > %FILE%
echo %gcmc% "$@" >> %FILE%

"%git%" --version

echo.
echo.git-credential-manager version:
"%git%" credential-manager --version

echo.
echo.git-credential-manager-core version:
"%git%" credential-manager-core --version
@REM echo.
@REM echo.git credential.helper:
@REM "%git%" config --show-origin --get-all credential.helper

echo.DONE
