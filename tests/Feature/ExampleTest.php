<?php

it('redirects to events page', function () {
    $response = $this->get('/');

    $response->assertRedirect('/events');
    $response->assertStatus(302);
});

it('events page returns successful response', function () {
    $response = $this->get('/events');

    $response->assertStatus(200);
});
