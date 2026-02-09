package org.thingsboard.server.common.data;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

public class TemperatureConverterTest {

    private static final double DELTA = 0.001;

    @Test
    public void testCelsiusToFahrenheit() {
        Assertions.assertEquals(32.0, TemperatureConverter.celsiusToFahrenheit(0), DELTA);
        Assertions.assertEquals(212.0, TemperatureConverter.celsiusToFahrenheit(100), DELTA);
    }

    @Test
    public void testFahrenheitToCelsius() {
        Assertions.assertEquals(0.0, TemperatureConverter.fahrenheitToCelsius(32), DELTA);
    }
}
