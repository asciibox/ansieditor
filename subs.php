<?php

function foreground($foreground) {
    
   return chr(27)."[38;5;".$foreground."m";
}

function background($background) {
    return chr(27)."[48;5;".$background."m";
     
}

$currentForeground=15;
$currentBackground=0;

fwrite($f, foreground(15));
fwrite($f, background(0));

$pos=0;
while ($pos<strlen($string)) {
    
    $extract = substr($string, $pos, 6);
    
    if (strcmp($extract,"brklne")==0) {
        fwrite($f, chr(13).chr(10));
    } else {
        $asciiCode=hexdec(substr($extract, 0, 2));
        $foreground=hexdec(substr($extract, 2, 2));
        $background=hexdec(substr($extract, 4, 2));
        
        if ( ($currentBackground==0) && ($asciiCode==32) ) {
            fwrite($f, foreground(0));
            $currentForeground=0;
        } else {
            if ($foreground!=$currentForeground) fwrite($f, foreground($foreground));#
            $currentForeground=$foreground;
        }
        if ($background!=$currentBackground) fwrite($f, background($background));
        
        fwrite($f, chr($asciiCode));
        
        $currentBackground=$background;
    }
    
    $pos=$pos+6;
    
}

fclose($f);

?>