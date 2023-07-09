import {UnitTestContext, setGlobalTestContext} from '../../contexts';
import {BasePageObject} from '../../pageObjects';
import {step} from '../index';

const reporter = {
    runStep: jest.fn((name, fn) => fn()),
};

setGlobalTestContext(new UnitTestContext({reporter}));

describe('step', () => {
    describe('Вызвал reporter.runStep,', () => {
        class StepPO extends BasePageObject {
            static rootSelector = '*';
        }

        it('если декоратор @step создали с именем в качестве строки', async () => {
            class TestPO extends StepPO {
                @step('test-step')
                async test(value: string) {
                    return value;
                }
            }

            const result = await new TestPO().test('test');

            expect(result).toBe('test');
            expect(reporter.runStep).toHaveBeenCalledWith('test-step', expect.any(Function));
        });

        it('если декоратор @step создали с именем в качестве ф-ии', async () => {
            class TestPO extends StepPO {
                @step(value => `${value}-step`)
                async test(value: string) {
                    return value;
                }
            }

            const result = await new TestPO().test('test');

            expect(result).toBe('test');
            expect(reporter.runStep).toHaveBeenCalledWith('test-step', expect.any(Function));
        });

        it('если вызвали метод контекста step', () => {
            class TestPO extends StepPO {
                test(value: string) {
                    return this.context.step(`${value}-step`, () => value);
                }
            }

            const result = new TestPO().test('test');

            expect(result).toBe('test');
            expect(reporter.runStep).toHaveBeenCalledWith('test-step', expect.any(Function));
        });

        it('и вызвал декорируемый метод с правильным контекстом', async () => {
            abstract class Foo extends BasePageObject {
                @step('test-step')
                async test() {
                    return this;
                }
            }

            abstract class Bar extends Foo {}

            class Baz extends Bar {
                static rootSelector = '*';
            }

            const baz = new Baz();
            const ctx = await baz.test();

            expect(ctx).toBe(baz);
            expect(reporter.runStep).toHaveBeenCalledWith('test-step', expect.any(Function));
        });
    });
});
