import React from 'react';

class Home extends React.Component {

    render(){
        
        return <>

            <section id="home">
                <div class="container">
                    <div class="row">
                    <div class="col-md-6 d-flex">
                        <div class="align-self-center">
                        <h1 class="display-4">Suas contas, descomplicadas</h1>
                        <p>
                            Usado por mais de 1 milhão de pessoas, o Finans é uma ferramenta online que vai facilitar sua vida financeira.
                        </p>

                        <form class="mt-4 mb-4">
                            <div class="input-group input-group-lg">
                            <input type="text" placeholder="Seu e-mail" class="form-control"/>
                            <div class="input-group-append">
                                <button type="button" class="btn btn-primary">Cadastre-se</button>
                            </div>
                            </div>
                        </form>

                        <p>Disponível para
                            <a href="" class="btn btn-outline-light">
                            <i class="fab fa-android fa-lg"></i>
                            </a>
                            <a href="" class="btn btn-outline-light">
                            <i class="fab fa-apple"></i>
                            </a>
                        </p>

                        </div>
                    </div>
                    <div class="col-md-6 d-none d-md-block">
                        <img src="img/capa-mulher.png"/>
                    </div>
                    </div>
                </div>
                </section>

                <section class="caixa">
                    <div class="container">
                        <div class="row">
                        <div class="col-md-6 d-flex">
                            <div class="align-self-center">
                            <h2>Saiba para onde vai o seu dinheiro</h2>
                            <p>
                                Com o Finans, você categoriza todos os seus lançamentos. Com gráficos simples, você sabe de onde vem e para onde vai o seu dinheiro.
                            </p>
                            <a href="" class="btn btn-primary">Veja mais</a>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <img src="img/saiba.png" class="img-fluid"/>
                        </div>
                        </div>
                    </div>
                    </section>

                    <section class="caixa">
                    <div class="container">
                        <div class="row">
                        <div class="col-md-6">
                            <img src="img/juros.png" class="img-fluid"/>
                        </div>
                        <div class="col-md-6 d-flex">
                            <div class="align-self-center">
                            <h2>Pare de pagar juros e economize</h2>
                            <p>
                                Manter as contas em dia é sempre um problema? O Finans avisa você: receba alertas de contas a pagar e a receber!
                            </p>
                            <a href="" class="btn btn-primary">Veja mais</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>

                    <section class="caixa">
                    <div class="container">
                        <div class="row">
                        <div class="col-md-4">
                            <img src="img/facil.png" class="img-fluid"/>
                            <h4>Fácil de usar</h4>
                            <p>
                            O Finans vai além do básico e permite que você faça controles incríveis, essenciais para suas finanças. Simples como tem que ser!
                            </p>
                        </div>
                        <div class="col-md-4">
                            <img src="img/economize.png" class="img-fluid"/>
                            <h4>Economize seu tempo</h4>
                            <p>
                            Tempo é dinheiro! Em segundos, você tem tudo sob controle e aproveite seu tempo com o que realmente importa pra você!
                            </p>
                        </div>
                        <div class="col-md-4">
                            <img src="img/suporte.png" class="img-fluid"/>
                            <h4>Suporte amigo</h4>
                            <p>
                            Dúvidas? Perguntas? Nosso suporte super legal ajuda você! A gente tá aqui pra resolver seus problemas e deixar sua vida bem mais fácil!
                            </p>
                        </div>
                        </div>
                    </div>
                    </section>
            
        </>; 
        
    }
}

export default Home;