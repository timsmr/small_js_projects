(function() {
    // создаем форму ввода количества столбцов
    function createFormTitle() {
        let wrapper = document.createElement('div');
        let header = document.createElement('h2');
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        wrapper.classList.add('container', 'form');
        header.classList.add('form-header');
        header.textContent = 'пары )';
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.type = 'number';
        input.min = '2';
        input.max = '6';
        input.placeholder = 'Введите количество столбцов';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.disabled = 'disabled';
        button.textContent = 'Играть!';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        wrapper.append(header);
        wrapper.append(form);

        return {
            wrapper,
            form,
            input,
            button
        };
    }

    // создание поля
    function createPlayground(input = 4) {
        let playground = document.createElement('div');
        playground.classList.add('row', `row-cols-${Number(input)}`);   
        return playground; 
    }

    // создание карточки
    function createCard() {
        let card = document.createElement('div');
        let box = document.createElement('div');

        card.classList.add('col');
        box.classList.add('box', 'box-closed');
        
        card.append(box);

        return card;
    }

    // функция рандомного списка значений карточек
    function randomValues(input) {
        let arr = []
        let size = Math.floor(Math.pow(Number(input), 2) / 2)
        for (let i = 1; i <= size; i++) {
            arr.push(...[i, i]);
        }
        for (i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    function endGame() {
        let msg = document.createElement('div');
        msg.classList.add('end-game')
        msg.innerHTML = `
            <h1>Вы выиграли!</h1>
            <h4>Чтобы сыграть еще раз<br>нажми на меня!</h4>
        `;
        return msg;
    }

    // создание игры
    document.addEventListener('DOMContentLoaded', () => {
        function startGame() {
            let form = createFormTitle();
        
            // выводим форму на экран
            document.body.append(form.wrapper);

            // убираем disabled с кнопки
            form.input.addEventListener('input', () => {
                if (form.input.value) {
                    form.button.removeAttribute('disabled');
                } else {
                    form.button.disabled = 'disabled'
                }
            });

            // начинаем игру при нажатии на кнопку
            form.form.addEventListener('submit', e => {
                e.preventDefault();

                let value = form.input.value;
                form.wrapper.remove();

                // создание поля
                let playground = createPlayground(value);
                let size = Math.floor(Math.pow(Number(value), 2) / 2) * 2;
                let rValues = randomValues(value);
                for (let i = 0; i < size; i++) {
                    let card = createCard();
                    card.querySelector('.box').id = i;
                    playground.append(card);
                }
                document.querySelector('.container').append(playground);

                // добавляем обработчик событий к кнопкам
                let cards = playground.querySelectorAll('.box');
                cards.forEach((card) => {
                    card.addEventListener('click', ()=> {
                        if (card.classList.contains('box-closed')) {
                            card.classList.remove('box-closed');
                            card.classList.add('box-opened')
                            card.style.setProperty('--box-value', `'${rValues[card.id]}'`);
                        }

                        // закрываем 2 разные карточки и делаем зелеными одинаковые карточки
                        let openedCards = playground.querySelectorAll('.box-opened');
                        if (openedCards.length == 2) {
                            setTimeout(() => {
                                if (rValues[openedCards[0].id] != rValues[openedCards[1].id]) {
                                    openedCards[0].classList.remove('box-opened');
                                    openedCards[0].classList.add('box-closed');
                                    openedCards[0].style.setProperty('--box-value', '');
                                    openedCards[1].classList.remove('box-opened');
                                    openedCards[1].classList.add('box-closed');
                                    openedCards[1].style.setProperty('--box-value', '');
                                } else {
                                    openedCards[0].classList.remove('box-opened');
                                    openedCards[0].classList.add('box-success');
                                    openedCards[1].classList.remove('box-opened');
                                    openedCards[1].classList.add('box-success');

                                    // завершаем игру если все одинаковые карточки открыты
                                    if (document.querySelectorAll('.box-success').length == size) {
                                        setTimeout(() => {
                                            let end = endGame();
                                            playground.remove();
                                            document.querySelector('.container').append(end);
                                            end.addEventListener('click', ()=> {
                                                end.remove();
                                                startGame();
                                            })
                                        }, 1000);

                                    }
                                }
                            }, 500);
                        }
                    })
                });    
            });
        }
        startGame();
    });
})();
