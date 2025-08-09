<?php

use App\Models\Comment;

it('returns a comment by id', function () {
    $comment = Comment::factory()->create();

    $response =  $this->get('/api/comment/' . $comment->id);

    $response->assertOk();
});

