<?php
$create_default=false; // When this is set to true, the export creates a default.txt file which can get converted to test.ans by calling create_default.php 
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


if (!is_dir("download")) {
    mkdir("download");
}

$string=$_POST['value'];

$filename=getRandomString(8);

if ($create_default) 
{
    $f=fopen("default.txt", "w");
    fwrite($f,$string);
    fclose($f);
    exit;
}

$f=fopen("download/".$filename.".ans", "w");


include("subs.php");


echo json_encode(array("filename" => $filename.".ans"));






?>