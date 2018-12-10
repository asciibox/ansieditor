<?php
include("set_your_keys.php");

  if(!function_exists('el_crypto_hmacSHA1')){
    /**
    * Calculate the HMAC SHA1 hash of a string.
    *
    * @param string $key The key to hash against
    * @param string $data The data to hash
    * @param int $blocksize Optional blocksize
    * @return string HMAC SHA1
    */
    function el_crypto_hmacSHA1($key, $data, $blocksize = 64) {
        if (strlen($key) > $blocksize) $key = pack('H*', sha1($key));
        $key = str_pad($key, $blocksize, chr(0x00));
        $ipad = str_repeat(chr(0x36), $blocksize);
        $opad = str_repeat(chr(0x5c), $blocksize);
        $hmac = pack( 'H*', sha1(
        ($key ^ $opad) . pack( 'H*', sha1(
          ($key ^ $ipad) . $data
        ))
      ));
        return base64_encode($hmac);
    }
  }

  if(!function_exists('el_s3_getTemporaryLink')){
    /**
    * Create temporary URLs to your protected Amazon S3 files.
    *
    * @param string $accessKey Your Amazon S3 access key
    * @param string $secretKey Your Amazon S3 secret key
    * @param string $bucket The bucket (bucket.s3.amazonaws.com)
    * @param string $path The target file path
    * @param int $expires In minutes
    * @return string Temporary Amazon S3 URL
    * @see http://awsdocs.s3.amazonaws.com/S3/20060301/s3-dg-20060301.pdf
    */
    
    function el_s3_getTemporaryLink($accessKey, $secretKey, $bucket, $path, $expires = 12000) {
	  if ( (strlen($secretKey)==0) || (strlen($accessKey)==0)  || (strlen($bucket)==0) ) return $path;
      // Calculate expiry time
      $expires = time() + intval(floatval($expires) * 60);
      // Fix the path; encode and sanitize
      $path = str_replace('%2F', '/', rawurlencode($path = ltrim($path, '/')));
      // Path for signature starts with the bucket
      $signpath = '/'. $bucket .'/'. $path;
      // S3 friendly string to sign
      $signsz = implode("\n", $pieces = array('GET', null, null, $expires, $signpath));
      // Calculate the hash
      $signature = el_crypto_hmacSHA1($secretKey, $signsz);
      // Glue the URL ...
      $url = sprintf('http://%s.s3.amazonaws.com/%s', $bucket, $path);
      // ... to the query string ...
      $qs = http_build_query($pieces = array(
        'AWSAccessKeyId' => $accessKey,
        'Expires' => $expires,
        'Signature' => $signature,
      ));
      // ... and return the URL!
      return html_entity_decode($url.'?'.$qs);
    }
  }
$mp3s=array("adg3.com_netProtect.mp3", "adg3.com_arcticDepths.mp3", "adg3.com_darkNebulae.mp3", "adg3.com_deepSpace.mp3", "adg3.com_dementedDream.mp3",
						"adg3.com_deployment.mp3", "adg3.com_evilIceCave.mp3", "adg3.com_filteredNation.mp3", "adg3.com_hybernation.mp3", "adg3.com_zipperZap.mp3");

	$filenames=array();
	$counter=1;
	$done=false;
	while ($done==false) {

		if (!isset($_GET['filename'.$counter])) {
			$done=true;
		} else {
			$filenames[]=$_GET['filename'.$counter];
			$counter++;
		}
		
	}

if (sizeof($filenames)==0) {
	$rand=rand(0, sizeof($mp3s)-1);
	$filename="asciinibbles/".$mp3s[$rand];
	$filename=el_s3_getTemporaryLink(AMAZON_CLOUDFRONT_ACCESS_KEY, AMAZON_CLOUDFRONT_SECRET_KEY, AMAZON_CLOUDFRONT_BUCKET_NAME, $filename);
	echo $filename;  
} else {
	$json=array();
	for ($i=0;$i<sizeof($filenames);$i++) 
	{
		$json['filename'.($i+1)]=$filename=el_s3_getTemporaryLink(AMAZON_CLOUDFRONT_ACCESS_KEY, AMAZON_CLOUDFRONT_SECRET_KEY, AMAZON_CLOUDFRONT_BUCKET_NAME, "asciinibbles/".$filenames[$i]);		
	}
	echo json_encode($json);
}
?>