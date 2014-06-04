<?php
function getRandomString($length = 10) {
    $validCharacters = "abcdefghijklmnopqrstuxyvwzABCDEFGHIJKLMNOPQRSTUXYVWZ0123456789";
    $validCharNumber = strlen($validCharacters);
 
    $result = "";
 
    for ($i = 0; $i < $length; $i++) {
        $index = mt_rand(0, $validCharNumber - 1);
        $result .= $validCharacters[$index];
    }
 
    return $result;
}

function foreground($foreground) {
    
   return chr(27)."[38;5;".$foreground."m";
}

function background($background) {
    return chr(27)."[48;5;".$background."m";
     
}

$string=$_POST['value'];

$filename=getRandomString(8);

$f=fopen("download/".$filename.".ans", "w");

$currentForeground=15;
$currentBackground=0;

fwrite($f, foreground(15));
fwrite($f, background(0));

$pos=0;
while ($pos<strlen($string)) {
    
    $extract = substr($string, $pos, 6);
    
    if (strcmp($extract,"brklne")==0) {
        fwrite($f, chr(10).chr(13));
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

echo json_encode(array("filename" => $filename.".ans"));






?>