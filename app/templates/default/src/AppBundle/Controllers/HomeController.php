<?php
namespace AppBundle\Controllers;

use WebComposer\Component\Http\Controller;

class HomeController extends Controller
{
    public function index()
    {
        return $this->twig->render('home.html.twig');
    }
}