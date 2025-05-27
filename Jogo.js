// Este arquivo de configuração é usado pelo Visual Studio Code para depuração.
        // Configuração do jogo
        const itemsData = [
            { type: 'plastic', name: 'Garrafa PET', emoji: '🧴' },
            { type: 'plastic', name: 'Sacola', emoji: '🛍️' },
            { type: 'paper', name: 'Jornal', emoji: '📰' },
            { type: 'paper', name: 'Caixa', emoji: '📦' },
            { type: 'glass', name: 'Garrafa', emoji: '🍾' },
            { type: 'metal', name: 'Lata', emoji: '🥫' },
            { type: 'metal', name: 'Arame', emoji: '🧵' },
            { type: 'plastic', name: 'Canudo', emoji: '🥤' },
            { type: 'paper', name: 'Revista', emoji: '📚' },
            { type: 'glass', name: 'Vidro', emoji: '🔮' },
            { type: 'metal', name: 'Prego', emoji: '🔩' }
        ];

        let score = 0;
        let draggedItem = null;

        // Inicializa o jogo
        function initGame() {
            score = 0;
            updateScore();
            document.getElementById('items').innerHTML = '';
            
            // Cria 8 itens aleatórios
            for (let i = 0; i < 8; i++) {
                const randomItem = itemsData[Math.floor(Math.random() * itemsData.length)];
                createItem(randomItem);
            }
        }

        // Cria um elemento de item arrastável
        function createItem(item) {
            const itemsContainer = document.getElementById('items');
            const itemElement = document.createElement('div');
            
            itemElement.className = 'item';
            itemElement.draggable = true;
            itemElement.dataset.type = item.type;
            itemElement.dataset.name = item.name;
            itemElement.textContent = item.emoji;
            itemElement.style.fontSize = '40px';
            itemElement.style.lineHeight = '80px';
            
            // Eventos de arrastar
            itemElement.addEventListener('dragstart', dragStart);
            
            itemsContainer.appendChild(itemElement);
        }

        // Função chamada quando começa a arrastar
        function dragStart(e) {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', e.target.dataset.type);
            setTimeout(() => {
                e.target.style.visibility = 'hidden';
            }, 0);
        }

        // Configura os alvos (lixeiras)
        function setupBins() {
            const bins = document.querySelectorAll('.bin');
            
            bins.forEach(bin => {
                bin.addEventListener('dragover', dragOver);
                bin.addEventListener('dragenter', dragEnter);
                bin.addEventListener('dragleave', dragLeave);
                bin.addEventListener('drop', drop);
            });
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragEnter(e) {
            e.preventDefault();
            e.target.style.backgroundColor = '#e0e0e0';
        }

        function dragLeave(e) {
            e.target.style.backgroundColor = '';
        }

        function drop(e) {
            e.preventDefault();
            e.target.style.backgroundColor = '';
            
            const binType = e.target.dataset.type;
            const itemType = draggedItem.dataset.type;
            
            if (binType === itemType) {
                // Acertou
                score += 10;
                draggedItem.style.display = 'none';
                showFeedback('✔️ Correto! +10 pontos', 'green');
            } else {
                // Errou
                score = Math.max(0, score - 5);
                showFeedback('❌ Errado! -5 pontos', 'red');
                // Faz o item voltar para a posição original
                setTimeout(() => {
                    draggedItem.style.visibility = 'visible';
                }, 0);
            }
            
            updateScore();
            checkGameEnd();
        }

        function showFeedback(message, color) {
            const feedback = document.createElement('div');
            feedback.textContent = message;
            feedback.style.color = '#fff';
            feedback.style.fontWeight = 'bold';
            feedback.style.position = 'absolute';
            feedback.style.top = '50%';
            feedback.style.left = '50%';
            feedback.style.transform = 'translate(-50%, -50%)';
            feedback.style.fontSize = '24px';
            feedback.style.zIndex = '1000';
            feedback.style.transition = 'opacity 0.5s';
            feedback.style.opacity = '1';
            feedback.style.pointerEvents = 'none';
            feedback.style.padding = '10px';
            feedback.style.borderRadius = '5px';

            // Define o background de acordo com a cor passada
            if (color === 'green') {
            feedback.style.backgroundColor = 'rgba(46, 204, 113, 0.95)'; // verde
            } else if (color === 'red') {
            feedback.style.backgroundColor = 'rgba(231, 7, 6, 0.95)'; // vermelho
            } else {
            feedback.style.backgroundColor = color;
            }

            document.getElementById('game-container').appendChild(feedback);

            setTimeout(() => {
            feedback.remove();
            }, 1000);
        }

        function updateScore() {
            document.getElementById('score').textContent = `Pontuação: ${score}`;
        }

        function checkGameEnd() {
            const items = document.querySelectorAll('.item:not([style*="display: none"])');
            if (items.length === 0) {
                setTimeout(() => {
                    alert(`Parabéns! Jogo concluído. Sua pontuação final: ${score}`);
                    initGame(); // Reinicia o jogo
                }, 500);
            }
        }

        // Inicializa o jogo quando a página carrega
        window.onload = function() {
            initGame();
            setupBins();
            
            document.getElementById('restart').addEventListener('click', initGame);
        };