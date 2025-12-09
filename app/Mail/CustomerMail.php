<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerMail extends Mailable
{
    use Queueable, SerializesModels;
    
    public $customer;
    public $subject;
    public $body;
    public $discord;
    public $name;
    public function __construct($customer, $subject, $body, $discord, $name)
    {
        $this->customer = $customer;
        $this->subject = $subject;
        $this->body = $body;
        $this->discord = $discord;
        $this->name = $name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mails.customermail',
            with: [
                'customer' => $this->customer,
                'subject'  => $this->subject,
                'body'  => $this->body,
                'discord'  => $this->discord,
                'name'     => $this->name
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
