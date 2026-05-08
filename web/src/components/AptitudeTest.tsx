import { useEffect, useState } from 'react'

type Question = {
  prompt: string
  options: [string, string, string, string, string, 'None of the above']
}

const TIMER_SECONDS = 15
const TEST_PROGRESS_KEY = 'meridian.aptitude.nextNumber'
const TEST_ANSWERS_KEY = 'meridian.aptitude.answers'
const TEST_SEQUENCE_KEY = 'meridian.aptitude.sequence'

const QUESTIONS: Question[] = [
  { prompt: 'Let A be a 4 x 4 matrix with characteristic polynomial (lambda - 2)^2(lambda + 1)(lambda - 5) and minimal polynomial (lambda - 2)(lambda + 1)(lambda - 5). What is dim ker(A - 2I)?', options: ['1', '2', '3', '4', 'Cannot be determined', 'None of the above'] },
  { prompt: 'If f(x)=integral from 0 to x of e^(-t^2) dt, what is the coefficient of x^7 in the Maclaurin series of f?', options: ['-1/42', '1/42', '-1/18', '1/30', '-1/7', 'None of the above'] },
  { prompt: 'A fair die is rolled until every face has appeared at least once. What is the expected number of rolls?', options: ['49/10', '147/10', '87/10', '6H_6', '36/5', 'None of the above'] },
  { prompt: 'For z satisfying z^5 = 1 and z != 1, evaluate 1 + 2z + 3z^2 + 4z^3 + 5z^4.', options: ['5/(z - 1)', '-5/(z - 1)', '5z/(z - 1)', '-5z/(z - 1)', '0', 'None of the above'] },
  { prompt: 'How many onto functions exist from a 7-element set to a 4-element set?', options: ['8400', '16384', '14400', '40824', '10080', 'None of the above'] },
  { prompt: 'Let X be normal with mean 8 and variance 9. What is E[(X - 8)^4]?', options: ['27', '81', '162', '243', '729', 'None of the above'] },
  { prompt: 'If gcd(a,b)=1, a divides c, and b divides c, which statement is necessarily true?', options: ['ab divides c', 'a+b divides c', 'a^2b divides c', 'lcm(a,b) divides c only if c is prime', 'a-b divides c', 'None of the above'] },
  { prompt: 'For the recurrence T(n)=3T(n/3)+n/log n, which asymptotic form best describes T(n)?', options: ['Theta(n)', 'Theta(n log log n)', 'Theta(n log n)', 'Theta(n^2)', 'Theta(log n)', 'None of the above'] },
  { prompt: 'The eigenvalues of a real symmetric 3 x 3 matrix are -2, 4, and 7. What is the maximum value of x^T A x over all unit vectors x?', options: ['-2', '4', '7', '9', '49', 'None of the above'] },
  { prompt: 'Evaluate the determinant of the 3 x 3 matrix with rows [1,2,3], [2,5,7], [4,9,13].', options: ['-1', '0', '1', '3', '5', 'None of the above'] },
  { prompt: 'If p is prime and p divides binomial(p,k) for 1 <= k <= p-1, what theorem is most directly being used?', options: ['Fermat little theorem', 'Euclid lemma plus factorial divisibility', 'Wilson theorem', 'Chinese remainder theorem', 'Cauchy theorem', 'None of the above'] },
  { prompt: 'Let g(x)=ln(1+x). What is g^(6)(0)?', options: ['-120', '120', '-720', '720', '1/6', 'None of the above'] },
  { prompt: 'A connected planar graph has 12 vertices, each of degree 3. How many faces does it have?', options: ['6', '8', '10', '12', '14', 'None of the above'] },
  { prompt: 'What is the residue of 7^222 modulo 13?', options: ['1', '3', '4', '9', '12', 'None of the above'] },
  { prompt: 'For a Poisson random variable X with mean 5, what is E[X(X-1)(X-2)]?', options: ['25', '75', '100', '125', '150', 'None of the above'] },
  { prompt: 'Let V be the vector space of polynomials of degree at most 5. What is the rank of the derivative operator D: V -> V?', options: ['4', '5', '6', '3', '0', 'None of the above'] },
  { prompt: 'If a group G has order 45, which subgroup order is guaranteed by Sylow theory?', options: ['5', '9', '15', '45 only', '3 only', 'None of the above'] },
  { prompt: 'Compute integral from 0 to 1 of x^3(1-x)^2 dx.', options: ['1/30', '1/45', '1/60', '1/90', '1/120', 'None of the above'] },
  { prompt: 'A linear transformation on R^3 has trace 6 and determinant 8, with one eigenvalue 2 of algebraic multiplicity 2. What is the third eigenvalue?', options: ['1', '2', '3', '4', '8', 'None of the above'] },
  { prompt: 'What is the coefficient of x^10 in (1-x)^(-4)?', options: ['220', '286', '364', '455', '560', 'None of the above'] },
  { prompt: 'For f(x,y)=x^2+4xy+5y^2, which classification describes the quadratic form?', options: ['Positive definite', 'Negative definite', 'Indefinite', 'Positive semidefinite only', 'Singular', 'None of the above'] },
  { prompt: 'If n is large, Stirling approximation gives log(n!) closest to which expression?', options: ['n log n - n + (1/2)log(2 pi n)', 'n log n + n', 'n^2/2', 'log(n^n)', 'n log log n', 'None of the above'] },
  { prompt: 'How many integer solutions satisfy x1+x2+x3+x4=20 with each xi >= 2?', options: ['455', '560', '680', '816', '969', 'None of the above'] },
  { prompt: 'The radius of convergence of sum from n=1 to infinity of n! x^n / n^n is:', options: ['0', '1/e', 'e', '1', 'Infinity', 'None of the above'] },
  { prompt: 'If A is idempotent, A^2=A, and trace(A)=7, what is rank(A)?', options: ['0', '1', '7', 'Cannot exceed 6', '49', 'None of the above'] },
  { prompt: 'In a field of characteristic 0, what is the formal derivative of x^7 - 3x^4 + 2x - 9?', options: ['7x^6 - 12x^3 + 2', 'x^6 - 3x^3 + 2', '7x^6 - 3x^3 + 2', '7x^6 - 12x^4 + 2x', '0', 'None of the above'] },
  { prompt: 'Let X and Y be independent with variances 4 and 9. What is Var(3X - 2Y)?', options: ['0', '24', '36', '72', '108', 'None of the above'] },
  { prompt: 'How many cyclic subgroups of order 5 are in a cyclic group of order 100?', options: ['1', '4', '5', '10', '20', 'None of the above'] },
  { prompt: 'If the Hessian of f at a critical point has eigenvalues -3, -1, and 2, the critical point is:', options: ['Strict local minimum', 'Strict local maximum', 'Saddle point', 'Flat plateau', 'Inconclusive because determinant is positive', 'None of the above'] },
  { prompt: 'Solve for the number of invertible 2 x 2 matrices over the finite field F_5.', options: ['300', '360', '480', '520', '600', 'None of the above'] },
  { prompt: 'Let S be the set of all permutations of 8 elements with exactly 3 fixed points. How many elements are in S?', options: ['560', '1120', '1568', '2240', '3136', 'None of the above'] },
  { prompt: 'If a Markov chain has transition matrix [[0.7,0.3],[0.2,0.8]], what is its stationary probability of state 1?', options: ['2/5', '3/5', '1/2', '1/3', '2/3', 'None of the above'] },
  { prompt: 'Compute the rank of the 4 x 4 matrix whose ij entry is i+j for i,j in {1,2,3,4}.', options: ['1', '2', '3', '4', '0', 'None of the above'] },
  { prompt: 'If phi is Euler totient, what is phi(2^5 * 3^2 * 5)?', options: ['384', '768', '960', '1152', '1440', 'None of the above'] },
  { prompt: 'Let h(x)=x^x for x>0. What is h prime at x=1?', options: ['0', '1', 'e', '2', 'ln 2', 'None of the above'] },
  { prompt: 'How many monic irreducible polynomials of degree 2 exist over F_7?', options: ['14', '21', '28', '35', '42', 'None of the above'] },
  { prompt: 'A sequence satisfies a_n=5a_{n-1}-6a_{n-2}, a_0=2, a_1=5. What is a_5?', options: ['122', '211', '275', '365', '485', 'None of the above'] },
  { prompt: 'If X has density f(x)=3x^2 on [0,1], what is E[-ln X]?', options: ['1/3', '1/2', '1', '3/2', '3', 'None of the above'] },
  { prompt: 'For the complex polynomial z^4+4, how many roots have positive real part?', options: ['0', '1', '2', '3', '4', 'None of the above'] },
  { prompt: 'What is the determinant of an n x n matrix with 2 on the diagonal and 1 off the diagonal?', options: ['n+1', '2n', '2^(n-1)(n+1)', 'n^2+n', '1', 'None of the above'] },
  { prompt: 'If A and B are independent events with P(A)=0.4 and P(A union B)=0.7, what is P(B)?', options: ['0.3', '0.4', '0.5', '0.6', '0.75', 'None of the above'] },
  { prompt: 'Evaluate sum from k=0 to 10 of (-1)^k binomial(10,k) k^3.', options: ['0', '-10!', '10!', '1000', '-1000', 'None of the above'] },
  { prompt: 'If the singular values of a matrix are 6, 3, and 1, what is its Frobenius norm squared?', options: ['10', '36', '46', '64', '100', 'None of the above'] },
  { prompt: 'For x^4 - 5x^2 + 4 = 0, what is the sum of positive roots?', options: ['1', '2', '3', '4', '5', 'None of the above'] },
  { prompt: 'How many spanning trees does the complete graph K_6 have?', options: ['216', '625', '1296', '7776', '46656', 'None of the above'] },
  { prompt: 'Let F_n be Fibonacci numbers with F_0=0 and F_1=1. What is gcd(F_24,F_36)?', options: ['F_6', 'F_12', 'F_24', 'F_36', '1', 'None of the above'] },
  { prompt: 'If a continuous random variable has CDF F(x)=x^4 on [0,1], what is its median?', options: ['1/2', '1/sqrt(2)', '2^(-1/4)', '1/4', '3/4', 'None of the above'] },
  { prompt: 'What is the dimension of the space of real symmetric 5 x 5 matrices?', options: ['10', '15', '20', '25', '30', 'None of the above'] },
  { prompt: 'Compute lim x->0 of (sin x - x + x^3/6)/x^5.', options: ['-1/120', '1/120', '-1/24', '1/24', '0', 'None of the above'] },
  { prompt: 'If a binary linear code has length 15, dimension 7, and minimum distance 5, how many codewords does it contain?', options: ['32', '64', '128', '256', '512', 'None of the above'] },
  { prompt: 'What is the order of 2 modulo 31?', options: ['5', '10', '15', '20', '30', 'None of the above'] },
  { prompt: 'Let B be a beta random variable with parameters 4 and 6. What is E[B]?', options: ['2/5', '3/5', '4/9', '4/10', '6/10', 'None of the above'] },
  { prompt: 'For the differential equation y prime = 3y with y(0)=7, what is y(2)?', options: ['7e^2', '7e^3', '7e^6', '21e^2', 'e^21', 'None of the above'] },
  { prompt: 'What is the maximum possible determinant of a 2 x 2 real matrix whose columns are unit vectors?', options: ['0', '1/2', '1', '2', '4', 'None of the above'] },
  { prompt: 'If an estimator is unbiased and has variance tending to 0, which property follows?', options: ['Consistency in mean square', 'Maximum likelihood', 'Sufficiency', 'Completeness', 'Ancillarity', 'None of the above'] },
  { prompt: 'How many ways are there to partition 10 labeled objects into 2 nonempty unlabeled blocks?', options: ['255', '511', '512', '1023', '1024', 'None of the above'] },
  { prompt: 'Let R be the region x^2+y^2<=9. What is integral over R of (x^2+y^2) dA?', options: ['81pi/2', '81pi', '243pi/2', '27pi', '9pi', 'None of the above'] },
  { prompt: 'If lambda is an eigenvalue of an orthogonal matrix over R, what must be true about complex lambda?', options: ['lambda is real', '|lambda|=1', 'lambda>0', 'lambda is rational', 'lambda=1', 'None of the above'] },
  { prompt: 'What is the probability that a random permutation of 5 elements is a single 5-cycle?', options: ['1/5', '1/4', '2/5', '1/2', '4/5', 'None of the above'] },
  { prompt: 'For the ring Z/84Z, how many units does it have?', options: ['12', '18', '20', '24', '36', 'None of the above'] },
  { prompt: 'If f is convex and differentiable, which inequality always holds?', options: ['f(y) >= f(x)+grad f(x)(y-x)', 'f(y) <= f(x)+grad f(x)(y-x)', 'f(x+y)=f(x)+f(y)', 'grad f is constant', 'f is bounded', 'None of the above'] },
  { prompt: 'Compute the trace of the projection matrix onto a 6-dimensional subspace of R^11.', options: ['5', '6', '11', '17', '66', 'None of the above'] },
  { prompt: 'How many positive divisors does 2^4 * 3^3 * 5^2 * 7 have?', options: ['60', '90', '120', '180', '240', 'None of the above'] },
  { prompt: 'Let A have eigenvalues 1, 2, 3. What are the eigenvalues of A^2 - 4A + 5I?', options: ['2,1,2', '1,2,3', '0,1,2', '2,5,10', '-2,-1,2', 'None of the above'] },
  { prompt: 'What is the expected number of inversions in a uniformly random permutation of n elements?', options: ['n(n-1)/2', 'n(n-1)/4', 'n^2/4', 'n log n', '2n', 'None of the above'] },
  { prompt: 'If y double prime + y = 0, y(0)=0, y prime(0)=2, what is y(pi/6)?', options: ['1', 'sqrt(3)', '2', '1/2', 'sqrt(3)/2', 'None of the above'] },
  { prompt: 'What is the number of edges in the 7-dimensional hypercube graph?', options: ['128', '224', '448', '896', '1024', 'None of the above'] },
  { prompt: 'If an n x n nilpotent matrix satisfies A^3=0 but A^2 != 0, what is the largest possible Jordan block size?', options: ['1', '2', '3', '4', 'n', 'None of the above'] },
  { prompt: 'Evaluate the contour integral of 1/z around the unit circle once counterclockwise.', options: ['0', '1', 'pi i', '2 pi i', '-2 pi i', 'None of the above'] },
  { prompt: 'What is the Shannon entropy in bits of a fair 8-sided die?', options: ['1', '2', '3', '4', '8', 'None of the above'] },
  { prompt: 'For A={1,2,3,4,5,6}, how many 3-element subsets have sum divisible by 3?', options: ['4', '6', '8', '10', '12', 'None of the above'] },
]

function shuffledQuestionIndexes() {
  const indexes = QUESTIONS.map((_, index) => index)
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexes[i], indexes[j]] = [indexes[j]!, indexes[i]!]
  }
  return indexes
}

function readSequence() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TEST_SEQUENCE_KEY) ?? 'null')
    if (Array.isArray(parsed) && parsed.length >= QUESTIONS.length) return parsed as number[]
  } catch {
    // Ignore invalid local storage and create a fresh sequence.
  }
  const sequence = shuffledQuestionIndexes()
  window.localStorage.setItem(TEST_SEQUENCE_KEY, JSON.stringify(sequence))
  return sequence
}

function readNextNumber() {
  const raw = Number(window.localStorage.getItem(TEST_PROGRESS_KEY))
  if (!Number.isFinite(raw)) return 1
  return Math.min(Math.max(Math.floor(raw), 1), QUESTIONS.length + 1)
}

function reserveNextNumber(number: number) {
  window.localStorage.setItem(TEST_PROGRESS_KEY, String(Math.min(number + 1, QUESTIONS.length + 1)))
}

function readAnswers(): Record<number, string> {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TEST_ANSWERS_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function AptitudeTest() {
  const [sequence] = useState(readSequence)
  const [currentNumber, setCurrentNumber] = useState(() => {
    const nextNumber = readNextNumber()
    reserveNextNumber(nextNumber)
    return nextNumber
  })
  const [answers, setAnswers] = useState<Record<number, string>>(readAnswers)
  const [selected, setSelected] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS)
  const questionIndex = sequence[currentNumber - 1]
  const question = questionIndex === undefined ? undefined : QUESTIONS[questionIndex]

  function moveForward(answer = selected || 'Timed out') {
    const nextAnswers = { ...answers, [currentNumber]: answer }
    window.localStorage.setItem(TEST_ANSWERS_KEY, JSON.stringify(nextAnswers))
    setAnswers(nextAnswers)

    const nextNumber = readNextNumber()
    if (nextNumber > QUESTIONS.length) {
      setCurrentNumber(QUESTIONS.length + 1)
    } else {
      reserveNextNumber(nextNumber)
      setCurrentNumber(nextNumber)
    }
    setSelected('')
    setSecondsLeft(TIMER_SECONDS)
  }

  useEffect(() => {
    if (!question) return
    setSecondsLeft(TIMER_SECONDS)
    const countdown = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0))
    }, 1000)
    const timer = window.setTimeout(() => moveForward(), TIMER_SECONDS * 1000)
    return () => {
      window.clearInterval(countdown)
      window.clearTimeout(timer)
    }
    // selected is intentionally omitted so changing options does not restart the 15-second window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNumber, question])

  function submitAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!question) return
    moveForward()
  }

  if (!question) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-white p-4 text-left dark:border-emerald-900/50 dark:bg-stone-900">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Work unlock assessment complete
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950 dark:text-stone-100">
          All {QUESTIONS.length} numbers have been submitted or timed out.
        </h2>
        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400">
          Payment remains pending while the submitted aptitude sequence is reviewed.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 text-left dark:border-stone-700 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#635BFF]">
            Work unlock aptitude test
          </p>
          <h2 className="mt-1 text-lg font-semibold text-stone-950 dark:text-stone-100">
            Number {currentNumber} of {QUESTIONS.length}
          </h2>
        </div>
        <span className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          {secondsLeft}s left
        </span>
      </div>

      <form className="mt-4" onSubmit={submitAnswer}>
        <p className="text-sm leading-relaxed text-stone-900 dark:text-stone-100">{question.prompt}</p>
        <div className="mt-4 grid gap-2">
          {question.options.map((option, index) => {
            const id = `q-${currentNumber}-${index}`
            return (
              <label
                key={option}
                htmlFor={id}
                className="flex cursor-pointer items-start gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 hover:border-[#635BFF]/50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200"
              >
                <input
                  id={id}
                  type="radio"
                  name={`question-${currentNumber}`}
                  value={option}
                  checked={selected === option}
                  onChange={(e) => setSelected(e.target.value)}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                </span>
              </label>
            )
          })}
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          Submit and continue
        </button>
      </form>
    </section>
  )
}
