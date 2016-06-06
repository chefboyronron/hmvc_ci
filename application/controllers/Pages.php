<?php
defined("BASEPATH") OR exit("no deirect script access allowed.");

class Pages extends CI_controller {
	
	public function __construct(){
		parent::__construct();
	}
	
	public function index(){
		header("location:pages/view");
		exit();
	}
	
	public function view($page = "home"){
		if ( ! file_exists(APPPATH.'/views/pages/'.$page.'.php')){
                show_404();
        }
		$data['title'] = ucfirst($page);
		$this->load->view('templates/header', $data);
        $this->load->view('pages/'.$page, $data);
        $this->load->view('templates/footer', $data);
	}
	
}