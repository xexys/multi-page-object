/**
 * Результат метода runStep делаем всегда асинхронным, так как такой интерфейс более универсальный
 * с точки зрения работы с любыми отчетами.
 *
 * Почему?
 *  - Например, результат работы runStep в Allure может быть Promise или нет, в зависимости от того,
 *    какой результат у переданной в runStep ф-ии. Однако, мы не можем гарантировать, что любые другие отчеты
 *    (если когда-нибудь решим использовать что-то другое) будут следовать такому же принципу.
 *  - Большинство методов PageObject-ов так и так будут асинхронными.
 */
export interface TestReporter {
    runStep<T>(name: string, fn: () => T | Promise<T>): Promise<T>;
}
