<?php
if (isset($_GET['qqfile'])) {
    $client_data = file_get_contents("php://input"); 
    $filename=rand(0,500000000);
    $fh=fopen('uploads/'.$filename.".ans","w");
    fwrite($fh,$client_data);
    fclose($fh);
       
    echo(json_encode(array("success" => true, "filename" => $filename)));
}

?>