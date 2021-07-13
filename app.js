const ScoreBoard = (game) => {
  const score = document.querySelector('#score')

  const obj = {
    score: parseInt(score.textContent)
  }

  game.EventHub.on('GameOver', () => {
    alert('GAME OVER! Your final score is ' + obj.score)
  })

  game.EventHub.on('AddScore', () => {
    obj.score += 1
    obj.draw()
  })

  obj.update = () => {}

  obj.draw = () => {
    score.textContent = obj.score
  }

  return obj
}

const Mole = (game) => {
  const squareList = document.querySelectorAll('.square')

  const obj = {
    position: null
  }

  squareList.forEach(square => {
    square.addEventListener('mouseup', () => {
      if (parseInt(square.id) === obj.position) {
        game.EventHub.emit('AddScore')
      }
    })
  })

  obj.update = () => {
    obj.position = Math.floor(Math.random() * 9 + 1)
  }

  obj.draw = () => {
    squareList.forEach(className => {
      className.classList.remove('mole')
    })
    squareList[obj.position - 1].classList.add('mole')
  }

  return obj
}

const Counter = (game) => {
  const timeLeft = document.querySelector('#time-left')

  const obj = {
    currentTime: parseInt(timeLeft.textContent)
  }

  obj.update = () => {
    obj.currentTime -= 1
    if(obj.currentTime === 0) {
      game.EventHub.emit('GameOver')
    }
  }

  obj.draw = () => {
    timeLeft.textContent = obj.currentTime
  }

  return obj
}

const EventHub = {
  events: {
    // 'key1': [fn],
    // 'key2': [],
  },

  emit(eventName, data){
    for(let key in this.events){
      if(key === eventName){
        let fnList = this.events[key]
        fnList.map((fn)=>{
          fn.call(undefined, data)
        })
      }
    }
  },

  on(eventName, fn){
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },
}

const MoleGame = () => {
  const obj = {
    EventHub
  }

  const timeId = setInterval(() => {

    // update
    obj.update()

    // draw
    obj.draw()

  }, 1000)

  obj.pause = () => {
    clearInterval(timeId)
  }

  obj.EventHub.on('GameOver', () => {
    obj.pause()
  })

  return obj
}

const __main = () => {
  const game = MoleGame()
  const counter = Counter(game)
  const mole = Mole(game)
  const scoreBoard = ScoreBoard(game)

  game.update = () => {
    counter.update()
    mole.update()
    scoreBoard.update()
  }

  game.draw = () => {
    counter.draw()
    mole.draw()
    scoreBoard.draw()
  }

}

__main()
