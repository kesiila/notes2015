# encoding: utf-8

class Number
    def to_s
        value.to_s
    end

    def inspect
        "<<#{self}>>"
    end
end

class Boolean
    def to_s
        value.to_s
    end

    def inspect
        "<<#{self}>>"
    end
end

class Variable
    def to_s
        value.to_s
    end

    def inspect
        "<<#{self}>>"
    end
end


class LessThan
    def reducible?
        true
    end

    def reduce (environment)
        if (left.reducible?)
            LessThan.new(left.reduce(environment),right)
        elsif (right.reducible?)
            LessThen.new(left,right.reduce(environment))
        else
            Boolean.new(left.value < right.value);
        end
    end
end

class Add
    def to_s
        "#{left} + #{righ}"
    end

    def inspect
        "<<#{self}>>"
    end
end

class Multiply
    def to_s
        "#{left} * #{right}"
    end

    def inspect
        "<<#{self}>>"
    end
end

class DoNothing
    def to_s
        'do-nothing'
    end

    def inspect
        "<<#{self}>>"
    end

    def ==(other_statement)
        other_statement.instance_of(DoNothing)
    end
end