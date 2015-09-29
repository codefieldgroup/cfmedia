<?php

$images = [ ];
for ($i = 1; $i < 27; $i++) {
  array_push(
    $images,
    [
      'meta' => $i.'.jpg'
    ]
  );
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  //  'name' => string '788769_34001721.jpg' (length=19)
  //  'type' => string 'image/jpeg' (length=10)
  //  'tmp_name' => string '/tmp/phpVck3cR' (length=14)
  //  'error' => int 0
  //  'size' => int 652460

  if ($_FILES['file']['error'] == 0) {
    $fileUpload = $_FILES['file'];

    $name      = $fileUpload['name'];
    $type      = $fileUpload['type'];
    $tmp_name  = $fileUpload['tmp_name'];
    $size      = $fileUpload['size'];
    $token     = md5( uniqid( mt_rand(), true ) );
    $ext       = explode( ".", $name );
    $ext       = $ext[count( $ext ) - 1];
    $file_copy = $token.'.'.$ext;

    if (move_uploaded_file( $tmp_name, __DIR__.'/upload/'.$file_copy )) {
      echo json_encode(
        [
          'meta' => $file_copy
        ]
      );
    }
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

  $limit  = $_REQUEST['limit'];
  $offset = $_REQUEST['offset'];
  $search = $_REQUEST['search'];

  if ($limit && $offset || $offset == 0) {
    $images = array_splice( $images, $offset, $limit );
  }

  echo json_encode( $images );
}