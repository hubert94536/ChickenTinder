#!/bin/sh
#####################################################
# React Native Clean
# Script to clean up metro, React Native and Watchman
#####################################################
clean() {

    echo "\n"

    echo "\n(╯°□°)╯ LET'S GO!"

    echo "\nClean up node modules.."

    rm -rf node_modules

    echo "\n(╯°□°)╯ Clean yarn cache and install packages..\n"

    yarn cache clean

    yarn install

    echo "\n(╯°□°)╯ Clear all temp directories..\n"

    rm -rf $TMPDIR/react-native-packager-cache-*

    rm -rf $TMPDIR/metro-*

    rm -rf $TMPDIR/react-*

    rm -rf $TMPDIR/haste-*

    echo "\n(╯°□°)╯ Clear all watchman watches..\n"

    watchman watch-del-all

    echo "\n(╯°□°)╯ Clean up iOS folders..\n"

    cd ios

    rm -rf Pods

    rm -rf Podfile.lock

    rm -rf build

    pod install

    cd ..

    echo "\n(╯°□°)╯ Clean up android folder..\n"

    cd android

    rm -rf build

    echo "\n(╯°□°)╯ DON'T FORGET TO DELETE THE APP AND RESTART SIMULATOR after cache is reset\n";

    # rm -rf ~/Library/Developer/Xcode/DerrivedData
    # expo c -r

    cd ..

    echo "\nt(-.-t) ALL CLEANED.\n"

    yarn start -- --reset-cache

}

echo "\n"
echo "|__)_ _  _|_  |\ | _ |_.   _" 
echo "| \(-(_|(_|_  | \|(_||_|\/(-\n"
echo "  :::::::: :::       ::::::::::    :::    ::::    :::"
echo " :+:    :+::+:       :+:         :+: :+:  :+:+:   :+:"
echo " +:+       +:+       +:+        +:+   +:+ :+:+:+  +:+"
echo " +#+       +#+       +#++:++#  +#++:++#++:+#+ +:+ +#+"
echo " +#+       +#+       +#+       +#+     +#++#+  +#+#+#" 
echo " #+#    #+##+#       #+#       #+#     #+##+#   #+#+#" 
echo " ######## #######################     ######    #### "
echo "\n (づ ￣ ³￣)づ  \"Fixin' dem watchman woes\"\n"

if [ "$1" = '' ]; then
    echo '(ಠ_ಠ) No path specified... Abort!\n'
else
    echo "*------------------------WARNING--------------------------*"
    echo "| CHECK THAT YOU ARE RUNNING THIS AT THE ROOT OF THE REPO |"
    echo "*------------------------WARNING--------------------------*"

    cd $1

    echo "\nCURRENT PATH: $(pwd)/\n"
    
    ls -ahl $1 | tail |  cut -d :  -f 2 | cut -d ' ' -f 2
    
    echo "\nYOU ARE ABOUT TO DO THE FOLLOWING:\n"

    echo "- Clean up node modules "
    echo "- Clean yarn cache and install packages"
    echo "- Clean all temp directories"
    echo "- Clear all watchman watches"
    echo "- Clean up iOS folders"
    echo "- Clean up android folder\n"

    read  -n 1 -p "Enter Y to continue or any other key to abort (ಠ_ಠ)..." input

    if [ $input = 'Y' ]; then
        clean
    elif [ $input = 'y' ]; then
        clean
    else 
        echo '\n(ಠ_ಠ) Abort!\n'
    fi
fi