<?php

namespace AppBundle\Tests\Controllers;

use AppBundle\Tests\WebTestCase as TestCase;

class AuthControllerTest extends TestCase{

    public function testLogin()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/login');

        $this->assertTrue($client->getResponse()->isOk());
        $this->assertCount(1, $crawler->filter('div#login'));
    }

    public function testSignup()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/signup');

        $this->assertTrue($client->getResponse()->isOk());
        $this->assertCount(1, $crawler->filter('div#signup'));
    }
}