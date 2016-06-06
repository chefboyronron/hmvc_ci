<?php
defined("BASEPATH") OR exit("no deirect script access allowed.");

class Hmvc extends CI_controller {
	
	public function __construct(){
		parent::__construct();
	}
	
	public function index($var = ""){
		
		echo $var;
		
	}
	
	public function view($var = ""){
		
		echo $var;
		
	}
	
}