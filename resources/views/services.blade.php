@extends('layouts.landing')

@section('title', 'Services')

@section('content')
    <h1>services</h1>
    @component('_components.card')
        @slot('title', 'services1')
        @slot('content', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.') 
    @endcomponent
        @component('_components.card')
        @slot('title', 'services2')
        @slot('content', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.') 
    @endcomponent
    @component('_components.card')
        @slot('title', 'services3')
        @slot('content', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.') 
    @endcomponent
@endsection