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
    return chr(27)."[48;5;".$background."m";
}

function background($background) {
    return chr(27)."[38;5;".$background."m";
}

$string=$_POST['value'];

$filename=getRandomString(8);

$f=fopen("download/".$filename.".ans", "w");

$currentForeground=999;
$currentBackground=999;

fwrite($f, foreground(15));
fwrite($f, background(0));

while (strlen($string)>0) {
    
    $extract = substr($string, 0, 9);
    $string=substr($string, 9);
    $asciiCode=substr($extract, 0, 3);
    $foreground=substr($extract, 3, 3);
    $background=substr($extract, 6, 3);
    
    fwrite($f, chr($asciiCode));
    if ($foreground!=$currentForeground) fwrite($f, foreground($foreground));
    if ($background!=$currentBackground) fwrite($f, background($background));
    
}

fclose($f);

echo json_encode(array("filename" => $filename.".ans"));






?>